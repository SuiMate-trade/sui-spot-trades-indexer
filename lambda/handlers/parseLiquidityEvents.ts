import { CETUS_PACKAGE_ADDRESS } from "../constants/index.js";
import {
  CetusAddOrRemoveLiquidityEventType,
  CetusOpenPositionEventType,
  CetusCollectLiquidityFeeEventType,
} from "../types/cetusLiquidityEventType.js";
import getPoolTokensMetadata from "../utils/getPoolTokensMetadata.js";

export const parseOpenPositionInCetusPoolEvent = async (
  event: CetusOpenPositionEventType
) => {
  try {
    const { parsedJson, sender, type, id, timestampMs } = event;

    if (type !== `${CETUS_PACKAGE_ADDRESS}::pool::OpenPositionEvent`) {
      throw new Error(`Invalid event type: ${type}`);
    }

    const { pool, position } = parsedJson;
    const { poolType, tokenAType, tokenBType } =
      await getPoolTokensMetadata(pool);

    return {
      sender,
      pool,
      poolType,
      position,
      tokenAType,
      tokenBType,
      platform: "cetus",
      timestampMs: parseInt(timestampMs),
      txnDigest: id.txDigest,
      event: "openLiquidityPosition",
    };
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const parseAddOrRemoveLiquidityToCetusPoolEvent = async (
  event: CetusAddOrRemoveLiquidityEventType
) => {
  try {
    const { parsedJson, sender, type, id, timestampMs } = event;

    if (
      type !== `${CETUS_PACKAGE_ADDRESS}::pool::AddLiquidityEvent` &&
      type !== `${CETUS_PACKAGE_ADDRESS}::pool::RemoveLiquidityEvent`
    ) {
      throw new Error(`Invalid event type: ${type}`);
    }

    const { pool, position } = parsedJson;
    const { poolType, tokenAType, tokenBType } =
      await getPoolTokensMetadata(pool);

    const tokenAAmount = parsedJson.amount_a;
    const tokenBAmount = parsedJson.amount_b;
    const liquidityAmount = parsedJson.liquidity;
    const afterLiquidity = parsedJson.after_liquidity;

    return {
      sender,
      pool,
      poolType,
      position,
      tokenAType,
      tokenBType,
      tokenAAmount,
      tokenBAmount,
      liquidityAmount,
      afterLiquidity,
      platform: "cetus",
      timestampMs: parseInt(timestampMs),
      txnDigest: id.txDigest,
      eventSeq: id.eventSeq,
      event:
        type === `${CETUS_PACKAGE_ADDRESS}::pool::AddLiquidityEvent`
          ? "addLiquidity"
          : "removeLiquidity",
    };
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const parseCollectLiquidityFeeInCetusPoolEvent = async (
  event: CetusCollectLiquidityFeeEventType
) => {
  try {
    const { parsedJson, sender, type, id, timestampMs } = event;

    if (type !== `${CETUS_PACKAGE_ADDRESS}::pool::CollectFeeEvent`) {
      throw new Error(`Invalid event type: ${type}`);
    }

    const { pool, position } = parsedJson;

    const { poolType, tokenAType, tokenBType } =
      await getPoolTokensMetadata(pool);

    const tokenAAmount = parsedJson.amount_a;
    const tokenBAmount = parsedJson.amount_b;

    return {
      sender,
      pool,
      poolType,
      position,
      tokenAType,
      tokenBType,
      tokenAAmount,
      tokenBAmount,
      platform: "cetus",
      timestampMs: parseInt(timestampMs),
      txnDigest: id.txDigest,
      eventSeq: id.eventSeq,
      event: "collectLiquidityFee",
    };
  } catch (err) {
    console.log(err);
    return null;
  }
};
