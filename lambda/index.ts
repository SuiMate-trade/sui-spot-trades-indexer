import BigNumber from "bignumber.js";
import {
  CETUS_PACKAGE_ADDRESS,
  KRIYA_SWAP_PACKAGE_ADDRESS,
} from "./constants/index.js";
import { parseKriyaSwapEvents } from "./handlers/parseKriyaSwapEvents.js";
import {
  parseAddOrRemoveLiquidityToCetusPoolEvent,
  parseCollectLiquidityFeeInCetusPoolEvent,
  parseOpenPositionInCetusPoolEvent,
} from "./handlers/parseLiquidityEvents.js";
import { parseCetusSwapEvent } from "./handlers/parseSwapEvent.js";
import { UserDataType } from "./types/userDataType.js";
import { firestore } from "./utils/firebase.js";
import getTokenValueInUsd from "./utils/getTokenValueInUsd.js";

export const handler = async (event) => {
  try {
    const txnEvent = JSON.parse(event[0].body);

    const eventType = txnEvent.type;

    const batch = firestore.batch();
    const userRef = firestore.collection("users").doc(txnEvent.sender);

    let userData: UserDataType = {
      totalVolumeSwapped: "0",
      lastTradedTimestampMs: txnEvent.timestampMs,
      totalLiquidityProvided: "0",
      liquidityFeesCollected: "0",
    };

    const userSnapshot = await userRef.get();
    if (userSnapshot.exists) {
      userData = userSnapshot.data() as UserDataType;
    }

    if (eventType === `${CETUS_PACKAGE_ADDRESS}::pool::SwapEvent`) {
      const dataToSave = await parseCetusSwapEvent(txnEvent);
      batch.set(userRef.collection("swaps").doc(), dataToSave);

      const valueInUSD = await getTokenValueInUsd(
        dataToSave.atob ? dataToSave.tokenBMetadata : dataToSave.tokenAMetadata,
        dataToSave.amountOut,
        dataToSave.timestampMs
      );
      userData.totalVolumeSwapped = BigNumber(userData.totalVolumeSwapped)
        .plus(valueInUSD)
        .toString();
      userData.lastTradedTimestampMs = txnEvent.timestampMs;

      batch.set(userRef, userData);
    }

    if (
      eventType.startsWith(`${KRIYA_SWAP_PACKAGE_ADDRESS}::spot_dex::SwapEvent`)
    ) {
      const dataToSave = await parseKriyaSwapEvents(txnEvent);
      batch.set(userRef.collection("swaps").doc(), dataToSave);

      const valueInUSD = await getTokenValueInUsd(
        dataToSave.atob ? dataToSave.tokenBMetadata : dataToSave.tokenAMetadata,
        dataToSave.amountOut,
        dataToSave.timestampMs
      );
      userData.totalVolumeSwapped = BigNumber(userData.totalVolumeSwapped)
        .plus(valueInUSD)
        .toString();
      userData.lastTradedTimestampMs = txnEvent.timestampMs;

      batch.set(userRef, userData);
    }

    if (eventType === `${CETUS_PACKAGE_ADDRESS}::pool::OpenPositionEvent`) {
      const dataToSave = await parseOpenPositionInCetusPoolEvent(txnEvent);
      batch.set(userRef.collection("liquidityEvents").doc(), dataToSave);
    }

    if (
      eventType === `${CETUS_PACKAGE_ADDRESS}::pool::AddLiquidityEvent` ||
      eventType === `${CETUS_PACKAGE_ADDRESS}::pool::RemoveLiquidityEvent`
    ) {
      const dataToSave =
        await parseAddOrRemoveLiquidityToCetusPoolEvent(txnEvent);
      batch.set(userRef.collection("liquidityEvents").doc(), dataToSave);

      const valueInUSDTokenA = await getTokenValueInUsd(
        dataToSave.tokenAMetadata,
        dataToSave.tokenAAmount,
        dataToSave.timestampMs
      );
      const valueInUSDTokenB = await getTokenValueInUsd(
        dataToSave.tokenBMetadata,
        dataToSave.tokenBAmount,
        dataToSave.timestampMs
      );

      if (eventType === `${CETUS_PACKAGE_ADDRESS}::pool::AddLiquidityEvent`) {
        userData.totalLiquidityProvided = BigNumber(
          userData.totalLiquidityProvided
        )
          .plus(valueInUSDTokenA)
          .plus(valueInUSDTokenB)
          .toString();
      } else {
        userData.totalLiquidityProvided = BigNumber(
          userData.totalLiquidityProvided
        )
          .minus(valueInUSDTokenA)
          .minus(valueInUSDTokenB)
          .toString();
      }

      userData.lastTradedTimestampMs = txnEvent.timestampMs;
      batch.set(userRef, userData);
    }

    if (eventType === `${CETUS_PACKAGE_ADDRESS}::pool::CollectFeeEvent`) {
      const dataToSave =
        await parseCollectLiquidityFeeInCetusPoolEvent(txnEvent);
      batch.set(userRef.collection("liquidityEvents").doc(), dataToSave);

      const valueInUSDTokenA = await getTokenValueInUsd(
        dataToSave.tokenAMetadata,
        dataToSave.tokenAAmount,
        dataToSave.timestampMs
      );

      const valueInUSDTokenB = await getTokenValueInUsd(
        dataToSave.tokenBMetadata,
        dataToSave.tokenBAmount,
        dataToSave.timestampMs
      );
      userData.liquidityFeesCollected = BigNumber(
        userData.liquidityFeesCollected
      )
        .plus(valueInUSDTokenA)
        .plus(valueInUSDTokenB)
        .toString();

      userData.lastTradedTimestampMs = txnEvent.timestampMs;
      batch.set(userRef, userData);
    }

    await batch.commit();

    const response = {
      statusCode: 200,
      body: JSON.stringify("Events saved to Firebase!"),
    };
    return response;
  } catch (error) {
    console.error(error);
    const response = {
      statusCode: 500,
      body: JSON.stringify("Error saving events to Firebase!"),
    };
    return response;
  }
};
