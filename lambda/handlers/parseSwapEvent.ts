import { CETUS_PACKAGE_ADDRESS } from "../constants/index.js";
import { CetusSwapEventType } from "../types/cetusSwapEventType.js";
import getPoolTokensMetadata from "../utils/getPoolTokensMetadata.js";

export const parseCetusSwapEvent = async (event: CetusSwapEventType) => {
  try {
    const { parsedJson, sender, type, timestampMs, id } = event;

    if (type !== `${CETUS_PACKAGE_ADDRESS}::pool::SwapEvent`) {
      throw new Error(`Invalid event type: ${type}`);
    }

    const { pool, atob, fee_amount } = parsedJson;
    const {
      content,
      tokenAMetadata,
      tokenBMetadata,
      poolType,
      tokenAType,
      tokenBType,
    } = await getPoolTokensMetadata(pool);

    const amountIn = parsedJson.amount_in;
    const amountOut = parsedJson.amount_out;

    const tokenAAmountInPool = (content.fields as any).coin_a;
    const tokenBAmountInPool = (content.fields as any).coin_b;
    const totalLiquidityInPool = (content.fields as any).liquidity;

    return {
      sender,
      pool,
      poolType,
      tokenAType,
      tokenBType,
      tokenAMetadata,
      tokenBMetadata,
      amountIn,
      amountOut,
      tokenAAmountInPool,
      tokenBAmountInPool,
      totalLiquidityInPool,
      platform: "cetus",
      timestampMs,
      atob,
      fees: fee_amount,
      txnDigest: id.txDigest,
      event: "swap",
    };
  } catch (err) {
    console.log(err.message);
    return null;
  }
};
