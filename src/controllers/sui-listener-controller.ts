import { PaginatedEvents } from "@mysten/sui.js";
import {
  SUI_LISTENER_SQS_QUEUE_NAME,
  suiModules,
  suiPackages,
} from "@/core/constants.js";
import baseRtdbRepository from "@/core/db/repositories/BaseRtdbRepository.js";
import { RuntimeError } from "@/core/errors.js";
import { log } from "@/core/utils/logger.js";
import { pushToSQS } from "@/core/utils/sqs.js";
import { queryEvents } from "@/core/utils/sui.js";
import { ReadSuiEventsResponseModel } from "@/models/sui-models.js";

const TRANSACTIONS_MAX_NUMBER = 50;

export async function readSuiEvents(): Promise<ReadSuiEventsResponseModel> {
  log("Reading cursors from db.");
  const moduleConfigPromises = [];

  suiModules.forEach((module, index) =>
    moduleConfigPromises.push(
      baseRtdbRepository.get(
        `spot-trade-modules/${suiPackages[index]}/${module}`
      )
    )
  );

  const moduleConfigs = await Promise.all(moduleConfigPromises);

  const eventsPromises: Promise<PaginatedEvents>[] = [];

  suiModules.forEach((module, index) => {
    const cursorConfig = moduleConfigs[index];
    const cursor =
      cursorConfig && cursorConfig.cursor ? cursorConfig.cursor : undefined;

    log(
      `Requesting ${TRANSACTIONS_MAX_NUMBER} events for module ${module} with cursor ${cursor}`
    );

    eventsPromises.push(
      queryEvents(suiPackages[index], module, cursor, TRANSACTIONS_MAX_NUMBER)
    );
  });

  const events = await Promise.all(eventsPromises);
  const eventObjects: any[] = [];
  events.forEach((event) => eventObjects.push(...event.data));

  log(`Number of received events: ${eventObjects.length}`);

  log("Pushing new events to SQS.");
  for (let i = 0; i < eventObjects.length; i++) {
    await pushToSQS(SUI_LISTENER_SQS_QUEUE_NAME, eventObjects[i]);
  }

  const configPromises: Promise<any>[] = [];
  const nextCursors = events.map((item) => item.nextCursor);

  log("Updating cursors.");
  nextCursors.forEach((newNextCursor, index) => {
    const cursorKey = `${suiPackages[index]}/${suiModules[index]}`;

    if (cursorKey === undefined) {
      throw new RuntimeError(`Module by index ${index} is not configured`);
    }

    if (newNextCursor) {
      const cursorValue = newNextCursor;

      const cursorConfig = {
        cursor: cursorValue,
      };

      log(
        `Updating next cursor for module ${cursorKey} in db - ${cursorValue}`
      );
      if (!moduleConfigs[index]) {
        configPromises.push(
          baseRtdbRepository.put(
            `spot-trade-modules/${cursorKey}`,
            cursorConfig
          )
        );
      } else {
        configPromises.push(
          baseRtdbRepository.update({
            [`spot-trade-modules/${cursorKey}`]: cursorConfig,
          })
        );
      }
    } else {
      log(`No next cursor for module ${cursorKey}.`);
    }
  });
  await Promise.all(configPromises);

  return new ReadSuiEventsResponseModel();
}
