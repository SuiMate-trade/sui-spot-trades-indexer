import BigNumber from "bignumber.js";
import {
  CETUS_PACKAGE_ADDRESS,
  KRIYA_SWAP_PACKAGE_ADDRESS,
  TURBOS_PACKAGE_ADDRESS,
} from "./constants/index.js";
import {
  parseKriyaFarmClaimEvents,
  parseKriyaFarmStakeEvents,
  parseKriyaFarmUnstakeEvents,
} from "./handlers/parseKriyaFramEvents.js";
import { parseKriyaSwapEvents } from "./handlers/parseKriyaSwapEvents.js";
import {
  parseAddOrRemoveLiquidityToCetusPoolEvent,
  parseCollectLiquidityFeeInCetusPoolEvent,
  parseOpenPositionInCetusPoolEvent,
} from "./handlers/parseLiquidityEvents.js";
import { parseCetusSwapEvent } from "./handlers/parseSwapEvent.js";
import {
  parseAddOrRemoveLiquidityToTurbosPoolEvent,
  parseCollectLiquidityFeeInTurbosPoolEvent,
} from "./handlers/parseTurbosLiquidityEvents.js";
import { parseTurbosSwapEvents } from "./handlers/parseTurbosSwapEvents.js";
import { UserDataType } from "./types/userDataType.js";
import { calculateLiquidityValue } from "./utils/calculateLiquidityValue.js";
import { firestore, rtdb } from "./utils/firebase.js";
import getTokenValueInUsd from "./utils/getTokenValueInUsd.js";

const liquidityInPoolInitialState = {
  platform: "",
  tokenAType: "",
  tokenAAmount: 0,
  tokenBType: "",
  tokenBAmount: 0,
  tokenAAmountEarned: 0,
  tokenBAmountEarned: 0,
};

const referenceTime = 1716580002048;

export const handler = async (event) => {
  try {
    const txnEvent = JSON.parse(event[0].body);

    const eventType = txnEvent.type;

    const batch = firestore.batch();
    const rtdbUpdates = {};
    const userRef = firestore.collection("users").doc(txnEvent.sender);

    let userData: UserDataType = {
      totalVolumeSwapped: 0,
      lastTradedTimestampMs: 0,
      totalLiquidityProvided: 0,
      liquidityFeesCollected: 0,
      totalStaked: 0,
      totalSwapsMade: 0,
      lastSwapTimestampMs: 0,
      lastLiquidityProvidedTimestampMs: 0,
      swapData: {
        cetus: {
          totalVolumeSwapped: 0,
          totalSwapsMade: 0,
        },
        kriya: {
          totalVolumeSwapped: 0,
          totalSwapsMade: 0,
        },
        turbos: {
          totalVolumeSwapped: 0,
          totalSwapsMade: 0,
        },
      },
    };

    const userSnapshot = await userRef.get();
    if (userSnapshot.exists) {
      userData = userSnapshot.data() as UserDataType;
    }

    if (eventType === `${CETUS_PACKAGE_ADDRESS}::pool::SwapEvent`) {
      const dataToSave = await parseCetusSwapEvent(txnEvent);
      rtdbUpdates[
        `/swaps/${dataToSave.sender}/${dataToSave.txnDigest}-${dataToSave.eventSeq}`
      ] = dataToSave;

      const valueInUSD = await getTokenValueInUsd(
        dataToSave.atob ? dataToSave.tokenBType : dataToSave.tokenAType,
        dataToSave.amountOut,
        dataToSave.timestampMs
      );
      userData.totalVolumeSwapped = BigNumber(userData.totalVolumeSwapped)
        .plus(valueInUSD)
        .toNumber();
      userData.lastTradedTimestampMs = parseFloat(txnEvent.timestampMs);
      userData.totalSwapsMade = userData.totalSwapsMade + 1;
      userData.lastSwapTimestampMs = parseFloat(txnEvent.timestampMs);
      userData.swapData.cetus.totalVolumeSwapped = BigNumber(
        userData.swapData.cetus.totalVolumeSwapped
      )
        .plus(valueInUSD)
        .toNumber();
      userData.swapData.cetus.totalSwapsMade =
        userData.swapData.cetus.totalSwapsMade + 1;

      batch.set(userRef, userData);
    }

    if (
      eventType.startsWith(`${KRIYA_SWAP_PACKAGE_ADDRESS}::spot_dex::SwapEvent`)
    ) {
      const dataToSave = await parseKriyaSwapEvents(txnEvent);
      rtdbUpdates[
        `/swaps/${dataToSave.sender}/${dataToSave.txnDigest}-${dataToSave.eventSeq}`
      ] = dataToSave;

      const valueInUSD = await getTokenValueInUsd(
        dataToSave.atob ? dataToSave.tokenBType : dataToSave.tokenAType,
        dataToSave.amountOut,
        dataToSave.timestampMs
      );
      userData.totalVolumeSwapped = BigNumber(userData.totalVolumeSwapped)
        .plus(valueInUSD)
        .toNumber();
      userData.lastTradedTimestampMs = parseFloat(txnEvent.timestampMs);
      userData.totalSwapsMade = userData.totalSwapsMade + 1;
      userData.lastSwapTimestampMs = parseFloat(txnEvent.timestampMs);
      userData.swapData.kriya.totalVolumeSwapped = BigNumber(
        userData.swapData.kriya.totalVolumeSwapped
      )
        .plus(valueInUSD)
        .toNumber();
      userData.swapData.kriya.totalSwapsMade =
        userData.swapData.kriya.totalSwapsMade + 1;

      batch.set(userRef, userData);
    }

    if (eventType === `${TURBOS_PACKAGE_ADDRESS}::pool::SwapEvent`) {
      const dataToSave = await parseTurbosSwapEvents(txnEvent);
      rtdbUpdates[
        `/swaps/${dataToSave.sender}/${dataToSave.txnDigest}-${dataToSave.eventSeq}`
      ] = dataToSave;

      const valueInUSD = await getTokenValueInUsd(
        dataToSave.atob ? dataToSave.tokenBType : dataToSave.tokenAType,
        dataToSave.amountOut,
        dataToSave.timestampMs
      );
      userData.totalVolumeSwapped = BigNumber(userData.totalVolumeSwapped)
        .plus(valueInUSD)
        .toNumber();
      userData.lastTradedTimestampMs = parseFloat(txnEvent.timestampMs);
      userData.totalSwapsMade = userData.totalSwapsMade + 1;
      userData.lastSwapTimestampMs = parseFloat(txnEvent.timestampMs);
      userData.swapData.turbos.totalVolumeSwapped = BigNumber(
        userData.swapData.turbos.totalVolumeSwapped
      )
        .plus(valueInUSD)
        .toNumber();
      userData.swapData.turbos.totalSwapsMade =
        userData.swapData.turbos.totalSwapsMade + 1;

      batch.set(userRef, userData);
    }

    // if (eventType === `${CETUS_PACKAGE_ADDRESS}::pool::OpenPositionEvent`) {
    //   const dataToSave = await parseOpenPositionInCetusPoolEvent(txnEvent);
    //   batch.set(userRef.collection("liquidityEvents").doc(), dataToSave);
    // }

    //---------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------
    if (
      eventType === `${CETUS_PACKAGE_ADDRESS}::pool::AddLiquidityEvent` ||
      eventType === `${CETUS_PACKAGE_ADDRESS}::pool::RemoveLiquidityEvent`
    ) {
      const dataToSave =
        await parseAddOrRemoveLiquidityToCetusPoolEvent(txnEvent);
      rtdbUpdates[
        `/liquidityEvents/${dataToSave.sender}/${dataToSave.txnDigest}-${dataToSave.eventSeq}`
      ] = dataToSave;

      const currentPoolState = await rtdb
        .ref(`/users/${dataToSave.sender}/liquidityPools/${dataToSave.pool}`)
        .once("value");

      const liquidityInPool =
        currentPoolState.val() || liquidityInPoolInitialState;
      liquidityInPool.tokenAType = dataToSave.tokenAType;
      liquidityInPool.tokenBType = dataToSave.tokenBType;
      liquidityInPool.platform = dataToSave.platform;

      if (dataToSave.event === "addLiquidity") {
        liquidityInPool.tokenAAmount = BigNumber(liquidityInPool.tokenAAmount)
          .plus(dataToSave.tokenAAmount)
          .toNumber();
        liquidityInPool.tokenBAmount = BigNumber(liquidityInPool.tokenBAmount)
          .plus(dataToSave.tokenBAmount)
          .toNumber();
      } else {
        liquidityInPool.tokenAAmount = BigNumber(liquidityInPool.tokenAAmount)
          .minus(dataToSave.tokenAAmount)
          .toNumber();
        liquidityInPool.tokenBAmount = BigNumber(liquidityInPool.tokenBAmount)
          .minus(dataToSave.tokenBAmount)
          .toNumber();
      }

      rtdbUpdates[
        `/users/${dataToSave.sender}/liquidityPools/${dataToSave.pool}`
      ] = {
        ...liquidityInPool,
      };

      const liquidityDeltaInUsd = await calculateLiquidityValue(
        dataToSave.tokenAType,
        dataToSave.tokenAAmount,
        dataToSave.tokenBType,
        dataToSave.tokenBAmount,
        referenceTime
      );

      if (eventType === `${CETUS_PACKAGE_ADDRESS}::pool::AddLiquidityEvent`) {
        userData.totalLiquidityProvided = BigNumber(
          userData.totalLiquidityProvided
        )
          .plus(liquidityDeltaInUsd)
          .toNumber();
      } else {
        userData.totalLiquidityProvided = BigNumber(
          userData.totalLiquidityProvided
        )
          .minus(liquidityDeltaInUsd)
          .toNumber();
      }

      userData.lastTradedTimestampMs = parseFloat(txnEvent.timestampMs);
      userData.lastLiquidityProvidedTimestampMs = parseFloat(
        txnEvent.timestampMs
      );
      batch.set(userRef, userData);
    }

    if (eventType === `${CETUS_PACKAGE_ADDRESS}::pool::CollectFeeEvent`) {
      const dataToSave =
        await parseCollectLiquidityFeeInCetusPoolEvent(txnEvent);
      rtdbUpdates[
        `/liquidityEvents/${dataToSave.sender}/${dataToSave.txnDigest}-${dataToSave.eventSeq}`
      ] = dataToSave;

      const currentPoolState = await rtdb
        .ref(`/users/${dataToSave.sender}/liquidityPools/${dataToSave.pool}`)
        .once("value");

      const liquidityInPool =
        currentPoolState.val() || liquidityInPoolInitialState;

      rtdbUpdates[
        `/users/${dataToSave.sender}/liquidityPools/${dataToSave.pool}`
      ] = {
        ...liquidityInPool,
        tokenAAmountEarned: BigNumber(liquidityInPool.tokenAAmountEarned)
          .plus(dataToSave.tokenAAmount)
          .toNumber(),
        tokenBAmountEarned: BigNumber(liquidityInPool.tokenBAmountEarned)
          .plus(dataToSave.tokenBAmount)
          .toNumber(),
      };

      const feesInUsd = await calculateLiquidityValue(
        dataToSave.tokenAType,
        dataToSave.tokenAAmount,
        dataToSave.tokenBType,
        dataToSave.tokenBAmount,
        referenceTime
      );

      userData.liquidityFeesCollected = BigNumber(
        userData.liquidityFeesCollected
      )
        .plus(feesInUsd)
        .toNumber();

      userData.lastTradedTimestampMs = parseFloat(txnEvent.timestampMs);
      userData.lastLiquidityProvidedTimestampMs = parseFloat(
        txnEvent.timestampMs
      );
      batch.set(userRef, userData);
    }

    //---------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------

    if (eventType === `${TURBOS_PACKAGE_ADDRESS}::pool::CollectEvent`) {
      const dataToSave =
        await parseCollectLiquidityFeeInTurbosPoolEvent(txnEvent);
      rtdbUpdates[
        `/liquidityEvents/${dataToSave.sender}/${dataToSave.txnDigest}-${dataToSave.eventSeq}`
      ] = dataToSave;

      const currentPoolState = await rtdb
        .ref(`/users/${dataToSave.sender}/liquidityPools/${dataToSave.pool}`)
        .once("value");

      const liquidityInPool =
        currentPoolState.val() || liquidityInPoolInitialState;

      rtdbUpdates[
        `/users/${dataToSave.sender}/liquidityPools/${dataToSave.pool}`
      ] = {
        ...liquidityInPool,
        tokenAAmountEarned: BigNumber(liquidityInPool.tokenAAmountEarned)
          .plus(dataToSave.tokenAAmount)
          .toNumber(),
        tokenBAmountEarned: BigNumber(liquidityInPool.tokenBAmountEarned)
          .plus(dataToSave.tokenBAmount)
          .toNumber(),
      };

      const feesInUsd = await calculateLiquidityValue(
        dataToSave.tokenAType,
        dataToSave.tokenAAmount,
        dataToSave.tokenBType,
        dataToSave.tokenBAmount,
        referenceTime
      );

      userData.liquidityFeesCollected = BigNumber(
        userData.liquidityFeesCollected
      )
        .plus(feesInUsd)
        .toNumber();

      userData.lastTradedTimestampMs = parseFloat(txnEvent.timestampMs);
      userData.lastLiquidityProvidedTimestampMs = parseFloat(
        txnEvent.timestampMs
      );
      batch.set(userRef, userData);
    }

    if (
      eventType === `${TURBOS_PACKAGE_ADDRESS}::pool::MintEvent` ||
      eventType === `${TURBOS_PACKAGE_ADDRESS}::pool::BurnEvent`
    ) {
      const dataToSave =
        await parseAddOrRemoveLiquidityToTurbosPoolEvent(txnEvent);
      rtdbUpdates[
        `/liquidityEvents/${dataToSave.sender}/${dataToSave.txnDigest}-${dataToSave.eventSeq}`
      ] = dataToSave;

      const currentPoolState = await rtdb
        .ref(`/users/${dataToSave.sender}/liquidityPools/${dataToSave.pool}`)
        .once("value");

      const liquidityInPool =
        currentPoolState.val() || liquidityInPoolInitialState;
      liquidityInPool.tokenAType = dataToSave.tokenAType;
      liquidityInPool.tokenBType = dataToSave.tokenBType;
      liquidityInPool.platform = dataToSave.platform;

      if (dataToSave.event === "addLiquidity") {
        liquidityInPool.tokenAAmount = BigNumber(liquidityInPool.tokenAAmount)
          .plus(dataToSave.tokenAAmount)
          .toNumber();
        liquidityInPool.tokenBAmount = BigNumber(liquidityInPool.tokenBAmount)
          .plus(dataToSave.tokenBAmount)
          .toNumber();
      } else {
        liquidityInPool.tokenAAmount = BigNumber(liquidityInPool.tokenAAmount)
          .minus(dataToSave.tokenAAmount)
          .toNumber();
        liquidityInPool.tokenBAmount = BigNumber(liquidityInPool.tokenBAmount)
          .minus(dataToSave.tokenBAmount)
          .toNumber();
      }

      rtdbUpdates[
        `/users/${dataToSave.sender}/liquidityPools/${dataToSave.pool}`
      ] = {
        ...liquidityInPool,
      };

      const liquidityDeltaInUsd = await calculateLiquidityValue(
        dataToSave.tokenAType,
        dataToSave.tokenAAmount,
        dataToSave.tokenBType,
        dataToSave.tokenBAmount,
        referenceTime
      );

      if (dataToSave.event === "addLiquidity") {
        userData.liquidityFeesCollected = BigNumber(
          userData.liquidityFeesCollected
        )
          .plus(liquidityDeltaInUsd)
          .toNumber();
      } else {
        userData.liquidityFeesCollected = BigNumber(
          userData.liquidityFeesCollected
        )
          .minus(liquidityDeltaInUsd)
          .toNumber();
      }

      userData.lastTradedTimestampMs = parseFloat(txnEvent.timestampMs);
      userData.lastLiquidityProvidedTimestampMs = parseFloat(
        txnEvent.timestampMs
      );
      batch.set(userRef, userData);
    }

    // if (
    //   eventType.startsWith(`${KRIYA_FARM_PACKAGE_ADDRESS}::farm::ClaimEvent`)
    // ) {
    //   const dataToSave = await parseKriyaFarmClaimEvents(txnEvent);
    //   batch.set(userRef.collection("liquidityEvents").doc(), dataToSave);

    //   const valueInUSD = await getTokenValueInUsd(
    //     dataToSave.tokenBMetadata,
    //     dataToSave.amount,
    //     dataToSave.timestampMs
    //   );

    //   userData.liquidityFeesCollected = BigNumber(
    //     userData.liquidityFeesCollected
    //   )
    //     .plus(valueInUSD)
    //     .toString();

    //   userData.lastTradedTimestampMs = txnEvent.timestampMs;
    //   batch.set(userRef, userData);
    // }

    // if (
    //   eventType.startsWith(`${KRIYA_FARM_PACKAGE_ADDRESS}::farm::UnstakeEvent`)
    // ) {
    //   const dataToSave = await parseKriyaFarmUnstakeEvents(txnEvent);
    //   batch.set(userRef.collection("stakeEvents").doc(), dataToSave);

    //   const valueInUSD = await getTokenValueInUsd(
    //     dataToSave.tokenAMetadata,
    //     dataToSave.unstakeAmount,
    //     dataToSave.timestampMs
    //   );

    //   userData.liquidityFeesCollected = BigNumber(userData.totalStaked)
    //     .minus(valueInUSD)
    //     .toString();

    //   userData.lastTradedTimestampMs = txnEvent.timestampMs;
    //   batch.set(userRef, userData);
    // }

    // if (
    //   eventType.startsWith(`${KRIYA_FARM_PACKAGE_ADDRESS}::farm::StakeEvent`)
    // ) {
    //   const dataToSave = await parseKriyaFarmStakeEvents(txnEvent);
    //   batch.set(userRef.collection("stakeEvents").doc(), dataToSave);

    //   const valueInUSD = await getTokenValueInUsd(
    //     dataToSave.tokenAMetadata,
    //     dataToSave.stakeAmount,
    //     dataToSave.timestampMs
    //   );

    //   userData.totalStaked = BigNumber(userData.totalStaked)
    //     .plus(valueInUSD)
    //     .toString();

    //   userData.lastTradedTimestampMs = txnEvent.timestampMs;
    //   batch.set(userRef, userData);
    // }

    await batch.commit();
    await rtdb.ref().update(rtdbUpdates);

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
