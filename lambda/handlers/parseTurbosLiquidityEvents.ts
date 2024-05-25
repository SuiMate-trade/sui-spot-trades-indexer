import { TURBOS_PACKAGE_ADDRESS } from "../constants/index.js";
import {
  TurbosAddOrRemoveLiquidityToPoolEventType,
  TurbosCollectLiquidityFeeEventType,
} from "../types/turbosLiquidityEventType.js";
import getPoolTokensMetadata from "../utils/getPoolTokensMetadata.js";

export const parseAddOrRemoveLiquidityToTurbosPoolEvent = async (
  event: TurbosAddOrRemoveLiquidityToPoolEventType
) => {
  try {
    const { parsedJson, sender, type, id, timestampMs } = event;

    if (
      type !== `${TURBOS_PACKAGE_ADDRESS}::pool::BurnEvent` &&
      type !== `${TURBOS_PACKAGE_ADDRESS}::pool::MintEvent`
    ) {
      throw new Error(`Invalid event type: ${type}`);
    }

    const { pool, amount_a, amount_b, liquidity_delta } = parsedJson;
    const { poolType, tokenAType, tokenBType } =
      await getPoolTokensMetadata(pool);

    const tokenAAmount = amount_a;
    const tokenBAmount = amount_b;
    const liquidityAmount = liquidity_delta;

    return {
      sender,
      pool,
      poolType,
      tokenAType,
      tokenBType,
      tokenAAmount,
      tokenBAmount,
      liquidityAmount,
      platform: "turbos",
      timestampMs: parseInt(timestampMs),
      txnDigest: id.txDigest,
      eventSeq: id.eventSeq,
      event:
        type === `${TURBOS_PACKAGE_ADDRESS}::pool::MintEvent`
          ? "addLiquidity"
          : "removeLiquidity",
    };
  } catch (error) {
    console.error(
      "Error parsing Turbos Add or Remove Liquidity to Pool Event",
      error
    );
    return null;
  }
};

export const parseCollectLiquidityFeeInTurbosPoolEvent = async (
  event: TurbosCollectLiquidityFeeEventType
) => {
  try {
    const { parsedJson, sender, type, id, timestampMs } = event;

    if (type !== `${TURBOS_PACKAGE_ADDRESS}::pool::CollectEvent`) {
      throw new Error(`Invalid event type: ${type}`);
    }

    const { pool } = parsedJson;

    const { poolType, tokenAType, tokenBType } =
      await getPoolTokensMetadata(pool);

    const tokenAAmount = parsedJson.amount_a;
    const tokenBAmount = parsedJson.amount_b;

    return {
      sender,
      pool,
      poolType,
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
  } catch (error) {
    console.error("Error parsing Turbos Liquidity Fee Collect Event", error);
    return null;
  }
};
