import BigNumber from "bignumber.js";
import { KRIYA_SWAP_PACKAGE_ADDRESS } from "../constants/index.js";
import { KriyaSwapEventType } from "../types/kriyaSwapEventType.js";
import { getPoolAssetsFromType } from "../utils/getPoolAssetsFromType.js";
import getPoolTokensMetadata from "../utils/getPoolTokensMetadata.js";

export const parseKriyaSwapEvents = async (event: KriyaSwapEventType) => {
  try {
    const { parsedJson, sender, type, id, timestampMs } = event;

    if (
      !type.startsWith(`${KRIYA_SWAP_PACKAGE_ADDRESS}::spot_dex::SwapEvent`)
    ) {
      throw new Error(`Invalid event type: ${type}`);
    }

    const { amount_in, amount_out, pool_id, reserve_x, reserve_y } = parsedJson;

    const {
      tokenAMetadata,
      tokenBMetadata,
      poolType,
      tokenAType,
      tokenBType,
      content,
    } = await getPoolTokensMetadata(pool_id);

    const amountIn = amount_in;
    const amountOut = amount_out;

    const tokenAAmountInPool = reserve_x;
    const tokenBAmountInPool = reserve_y;
    const totalLiquidityInPool = BigNumber(reserve_x)
      .plus(BigNumber(reserve_y))
      .toString();

    const assetIn = getPoolAssetsFromType(poolType);
    const atob = assetIn === tokenAType ? true : false;

    const feePercent = (content as any).protocol_fee_percent;
    const feeAmount = BigNumber(amountIn).times(feePercent).div(100).toString();

    return {
      sender,
      pool: pool_id,
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
      platform: "kriya",
      timestampMs,
      atob,
      fees: feeAmount,
      txnDigest: id.txDigest,
      event: "swap",
    };
  } catch (err) {
    console.log(err);
    return null;
  }
};
