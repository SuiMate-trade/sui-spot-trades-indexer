import BigNumber from "bignumber.js";
import { KRIYA_SWAP_PACKAGE_ADDRESS } from "../constants/index.js";
import {
  KriyaAddLiquidityEventType,
  KriyaSwapEventType,
} from "../types/kriyaSwapEventType.js";
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

    const { poolType, tokenAType, tokenBType, content } =
      await getPoolTokensMetadata(pool_id);

    const amountIn = amount_in;
    const amountOut = amount_out;

    const tokenAAmountInPool = reserve_x;
    const tokenBAmountInPool = reserve_y;
    const totalLiquidityInPool = BigNumber(reserve_x)
      .plus(BigNumber(reserve_y))
      .toString();

    const assetIn = getPoolAssetsFromType(type);
    const atob = assetIn === tokenAType ? true : false;

    return {
      sender,
      pool: pool_id,
      poolType,
      tokenAType,
      tokenBType,
      amountIn,
      amountOut,
      tokenAAmountInPool,
      tokenBAmountInPool,
      totalLiquidityInPool,
      platform: "kriya",
      timestampMs: parseInt(timestampMs),
      atob,
      txnDigest: id.txDigest,
      eventSeq: id.eventSeq,
      event: "swap",
    };
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const parseKriyaAddLiquidityEvents = async (
  event: KriyaAddLiquidityEventType
) => {
  try {
    const { parsedJson, sender, type, id, timestampMs } = event;

    if (
      !type.startsWith(
        `${KRIYA_SWAP_PACKAGE_ADDRESS}::spot_dex::LiquidityAddedEvent`
      )
    ) {
      throw new Error(`Invalid event type: ${type}`);
    }

    const { amount_x, amount_y, pool_id, lsp_minted } = parsedJson;

    const { poolType, tokenAType, tokenBType, content } =
      await getPoolTokensMetadata(pool_id);

    const feePercent: string = (content as any).protocol_fee_percent;
    const feeAmount = BigNumber(amount_x).times(feePercent).div(100).toString();

    return {
      sender,
      pool: pool_id,
      poolType,
      tokenAType,
      tokenBType,
      tokenAAmount: amount_x,
      tokenBAmount: amount_y,
      platform: "kriya",
      timestampMs: parseInt(timestampMs),
      fees: feeAmount,
      txnDigest: id.txDigest,
      event: "add_liquidity",
      lspMinted: lsp_minted,
    };
  } catch (err) {
    console.log(err);
    return null;
  }
};
