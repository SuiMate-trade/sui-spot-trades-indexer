import { TURBOS_PACKAGE_ADDRESS } from "../constants/index";
import { TurbosSwapEventType } from "../types/turbosSwapEventType";
import getPoolTokensMetadata from "../utils/getPoolTokensMetadata";

export const parseTurbosSwapEvents = async (event: TurbosSwapEventType) => {
  try {
    const { parsedJson, sender, type, id, timestampMs } = event;

    if (!type.startsWith(`${TURBOS_PACKAGE_ADDRESS}::pool::SwapEvent`)) {
      throw new Error(`Invalid event type: ${type}`);
    }

    const { amount_a, amount_b, fee_amount, liquidity, pool, a_to_b } =
      parsedJson;

    const { poolType, tokenAType, tokenBType } =
      await getPoolTokensMetadata(pool);

    const amountIn = a_to_b ? amount_a : amount_b;
    const amountOut = a_to_b ? amount_b : amount_a;

    const totalLiquidityInPool = liquidity;

    const atob = parsedJson.a_to_b;

    const feeAmount = fee_amount;

    return {
      sender,
      pool,
      poolType,
      tokenAType,
      tokenBType,
      amountIn,
      amountOut,
      totalLiquidityInPool,
      platform: "turbos",
      timestampMs: parseInt(timestampMs),
      atob,
      fees: feeAmount,
      txnDigest: id.txDigest,
      eventSeq: id.eventSeq,
      event: "swap",
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
