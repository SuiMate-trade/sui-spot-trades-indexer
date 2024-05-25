// src/core/constants.ts
var SUI_LISTENER_SQS_QUEUE_NAME = `sui-spot-trades-queue.fifo`;
var CETUS_PACKAGE_ADDRESS = "0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb";
var TURBOS_PACKAGE_ADDRESS = "0x91bfbc386a41afcfd9b2533058d7e915a1d3829089cc268ff4333d54d6339ca1";
var KRIYA_SWAP_PACKAGE_ADDRESS = "0xa0eba10b173538c8fecca1dff298e488402cc9ff374f8a12ca7758eebe830b66";
var CETUS_POOL_MODULE = "pool";
var KRIYA_SPOT_MODULE = "spot_dex";
var TURBOS_POOL_MODULE = "pool";
var AWS_ACCOUNT_ID = "966847549611";
var SQS_ENDPOINT = "sqs.ap-south-1.amazonaws.com";
var REGION = "ap-south-1";
var suiModules = [
  CETUS_POOL_MODULE,
  KRIYA_SPOT_MODULE,
  TURBOS_POOL_MODULE
];
var suiPackages = [
  CETUS_PACKAGE_ADDRESS,
  KRIYA_SWAP_PACKAGE_ADDRESS,
  TURBOS_PACKAGE_ADDRESS
];
var SUI_RPC_ENDPOINT = "https://sui-mainnet-rpc.nodereal.io";

// src/core/utils/firebase.ts
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getDatabase } from "firebase-admin/database";
var firebaseConfig = {
  credential: admin.credential.cert({
    projectId: "suimate-spot-trades",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDHBG+N+x+dD8pP\nmREpMqqn7YslCGoIDXBlLxtzEArtaOrUc93z60JU5HilgzmqBH8V/nanII6Npr9a\ndnf7IzjQEpz+TR8G81xdpIrtXp0KAP0hCvIYfCBbe8000gCapBJy1F3ZiMXse3dD\nNwWrM2e9Dlm7BasNmO9IJmaJXU9dBJylkRzShSmW2ulw5M+/PrSNtzX2dSEk4M1c\nYFWCu7SxcdIbNh9WsptiVU47Q6fF58MBS4af6n69fm2JXScMsWPgQelJXxEybOE7\nzzb7C/JCzCsd7Gl2lB9/6zJYsOF/Yf6fhV88m/u0xo9TjDa988jOQePLLOYa8pIs\nHlR08ArNAgMBAAECggEABNvW3WCEJRF9nvPdt2PFRtRF0WGjNQ8e71l3EhgSLDmj\nggxSHuJffDMXvvK1NbFmaOMNgocI8+xeP5ck1rzFZk8OBidb2o+WcbLSsXjd3KCp\njWT3BCIDqDgdimyWFzBqQuNsZyMvsdZR0xJE0SkwHy16g1ZgFrTlIp3NYw0kIuEu\n3JxMmpbeYs3SK0Myzyn5j58VJRRTB1FKw2gcHhUec/j9JZucnNuGkiEkNubtf6MR\n4lkFsAk7rQ8FcjvkTsHNSHSvFE1Bgbsw1vhO8si5rSBlMSzo4bFvskYmbYiIu1xO\n3wjTWbCuW5/AtbeAk+nNytyYTIuRqKn4zScHqW9vAQKBgQD64nEJhkAUUVEcw6Ac\n5GZZ+D2dWsbLDEQk70KGnty4YUwOcb77lUDAvvH208L7WbwNn0AhCoBaL6GHiI+j\nP0Ed9PEB5DMXAwMB+DyReEVdTPVh9fHuWcMDhQX1giIOXfPsP9YSFIwSb86qDY1s\nws1itfzGdLLaX0GSpvxLhA8fHwKBgQDLE0Jw6m8qw5XNyJHOowooaJJu+3IotqQB\nRkG5a1prf5jJAan8ACSBadWGweE/2ijnt1bpQRt4BwgEhbVtnmGL9T3HPMxT8oCA\nMr/Hk3fJyLUigT395WftTnClNXGpjCTBMu7reVZNs1nDHkgFmDV8Y2hy6lZ+QYKv\nBSjx05VUkwKBgE+ZMpX8Ay6vEhYXNyCTkqmu6hWXrITVknVJeAjwNEVHkXLvwdFe\nbFn6+xf93doTgWetBBK3mzuB6zTuLex0cDuJ8EFSXqdJbFXepZDd4NwWQ7Bd8PFX\nh1kBhn97V0TJqE9nfYrk/AAJez9W52z/bVyJMvbgJbLFEC/wTRHEh2uvAoGBAILu\nAfJnVBFQVO9+l3OQ7uWqtm7Ts4DIcOlZcNqpenzAobNHXV9agC7oG4Fs01ulvqXX\nMTPmhF1YuzSfOKBacy4XiiNA8cRWH7+H+NomHB9/Rjne9icSl3ULE9mQoZ3c+32M\n5znu21PxhLgmd+0Te7idJySgLe/tMOLDAukXr7n9AoGARDYfi7ITL8ZnNAfyjxrW\nrNlq9V/ROKH3VEBcDj7ZaircW1gKEiVTWRkB/dopWv38WnrqLvrX+oOgx8kpiC+W\nUOObXbvwXwJmDyfKKnimD+/Vc0+g+gmc83vzxxwquqMSWnf9ui41gnrgo0x4wgSL\np7iGb09CmyujMDexgU12970=\n-----END PRIVATE KEY-----\n",
    clientEmail: "firebase-adminsdk-nx6mt@suimate-spot-trades.iam.gserviceaccount.com"
  }),
  databaseURL: "https://suimate-spot-trades-default-rtdb.firebaseio.com"
};
var app = admin.apps.length ? admin.app() : admin.initializeApp(firebaseConfig);
var firestore = getFirestore(app);
var rtdb = getDatabase(app);

// src/core/db/repositories/BaseRtdbRepository.ts
var BaseRtdbRepository = class {
  dbRef;
  constructor() {
    this.dbRef = rtdb.ref();
  }
  async get(ref) {
    const snapshot = await this.dbRef.child(ref).get();
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available for ref: " + ref);
      return null;
    }
  }
  async put(ref, data) {
    await this.dbRef.child(ref).set(data);
    return data;
  }
  async update(updates) {
    await this.dbRef.update(updates);
  }
};
var baseRtdbRepository = new BaseRtdbRepository();
var BaseRtdbRepository_default = baseRtdbRepository;

// src/core/errors.ts
var RuntimeError = class extends Error {
};

// src/core/utils/logger.ts
var log = (obj, _level = 2 /* INFO */) => {
  console.log(obj, _level);
};

// src/core/utils/sqs.ts
import AWS from "aws-sdk";
import fetch from "cross-fetch";
global.fetch = fetch;
var AwsConfig = {
  accessKeyId: "ASIA6CHE22CV7QUJWQAX",
  accessSecretKey: "z1ySweITv46WbsKwkb9fcp",
  region: "ap-south-1"
};
AWS.config.update(AwsConfig);
var client = new AWS.SQS({
  endpoint: SQS_ENDPOINT,
  region: REGION
});
var QUEUE_URL = `https://${SQS_ENDPOINT}/${AWS_ACCOUNT_ID}/`;
async function pushToSQS(queueName, content) {
  try {
    log(`Pushing event to queue ${queueName}.`);
    const result = await client.sendMessage({
      QueueUrl: QUEUE_URL + queueName,
      MessageBody: JSON.stringify(content),
      MessageGroupId: "event"
    }).promise();
    log(
      `Successfully published event to SQS. Message ID: ${result.MessageId}`,
      1 /* DEBUG */
    );
    return result;
  } catch (err) {
    log(`Unable to publish event to SQS. Error: ${err.stack}`);
    throw err;
  }
}

// src/core/utils/sui.ts
import { SuiHTTPTransport, SuiClient } from "@mysten/sui.js/client";
var client2 = new SuiClient({
  transport: new SuiHTTPTransport({
    url: SUI_RPC_ENDPOINT
  })
});
async function queryEvents(packageAddress, moduleLib, cursor, maxTxNumber) {
  const response = await client2.queryEvents({
    cursor,
    limit: maxTxNumber,
    order: "ascending",
    query: {
      MoveEventModule: {
        package: packageAddress,
        module: moduleLib
      }
    }
  });
  return response;
}

// src/models/sui-models.ts
var ReadSuiEventsRequestModel = class {
};
var ReadSuiEventsResponseModel = class {
};

// src/controllers/sui-listener-controller.ts
var TRANSACTIONS_MAX_NUMBER = 50;
async function readSuiEvents() {
  log("Reading cursors from db.");
  const moduleConfigPromises = [];
  suiModules.forEach(
    (module, index) => moduleConfigPromises.push(
      BaseRtdbRepository_default.get(
        `spot-trade-modules/${suiPackages[index]}/${module}`
      )
    )
  );
  const moduleConfigs = await Promise.all(moduleConfigPromises);
  const eventsPromises = [];
  suiModules.forEach((module, index) => {
    const cursorConfig = moduleConfigs[index];
    const cursor = cursorConfig && cursorConfig.cursor ? cursorConfig.cursor : void 0;
    log(
      `Requesting ${TRANSACTIONS_MAX_NUMBER} events for module ${module} with cursor ${cursor}`
    );
    eventsPromises.push(
      queryEvents(suiPackages[index], module, cursor, TRANSACTIONS_MAX_NUMBER)
    );
  });
  const events = await Promise.all(eventsPromises);
  const eventObjects = [];
  events.forEach((event) => eventObjects.push(...event.data));
  log(`Number of received events: ${eventObjects.length}`);
  log("Pushing new events to SQS.");
  for (let i = 0; i < eventObjects.length; i++) {
    await pushToSQS(SUI_LISTENER_SQS_QUEUE_NAME, eventObjects[i]);
  }
  const configPromises = [];
  const nextCursors = events.map((item) => item.nextCursor);
  log("Updating cursors.");
  nextCursors.forEach((newNextCursor, index) => {
    const cursorKey = `${suiPackages[index]}/${suiModules[index]}`;
    if (cursorKey === void 0) {
      throw new RuntimeError(`Module by index ${index} is not configured`);
    }
    if (newNextCursor) {
      const cursorValue = newNextCursor;
      const cursorConfig = {
        cursor: cursorValue
      };
      log(
        `Updating next cursor for module ${cursorKey} in db - ${cursorValue}`
      );
      if (!moduleConfigs[index]) {
        configPromises.push(
          BaseRtdbRepository_default.put(
            `spot-trade-modules/${cursorKey}`,
            cursorConfig
          )
        );
      } else {
        configPromises.push(
          BaseRtdbRepository_default.update({
            [`spot-trade-modules/${cursorKey}`]: cursorConfig
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

// src/core/utils/ecs.ts
async function runTask(task) {
  try {
    log(`Start executing task ${task.name}`);
    await task();
  } catch (error) {
    log("ECS task handler execution failed.", 4 /* ERROR */);
    log(error, 4 /* ERROR */);
  }
}

// src/core/utils/schedule.ts
import fetch2 from "cross-fetch";
global.fetch = fetch2;
async function handleScheduleRequest(requestParams, handlerFunc) {
  try {
    const result = await handlerFunc(requestParams);
    log(
      `Handling of Scheduled event completed with result ${JSON.stringify(
        result
      )}`,
      2 /* INFO */
    );
  } catch (error) {
    log("Scheduled handler execution failed.", 4 /* ERROR */);
    log(error, 4 /* ERROR */);
  }
}

// src/core/utils/time.ts
var sleep = (delayMs) => (
  // @ts-ignore
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delayMs);
  })
);

// src/handlers/ecs/sui-events-listener.ts
var DELAY_MS = 1e3;
async function readSuiEventsLoop() {
  log("Start SUI listener.");
  while (true) {
    const request = new ReadSuiEventsRequestModel();
    await handleScheduleRequest(request, readSuiEvents);
    await sleep(DELAY_MS);
  }
}
var handler = async () => runTask(readSuiEventsLoop);
handler();
