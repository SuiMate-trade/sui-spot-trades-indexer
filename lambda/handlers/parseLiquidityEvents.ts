import { CETUS_PACKAGE_ADDRESS } from "../constants/index.js";
import {
  CetusAddOrRemoveLiquidityEventType,
  CetusOpenPositionEventType,
  CetusCollectLiquidityFeeEventType,
} from "../types/cetusLiquidityEventType.js";
import { CetusPoolContentType } from "../types/poolContentType.js";
import { getPoolAssetsFromType } from "../utils/getPoolAssetsFromType.js";
import client from "../utils/sui.js";

export const parseOpenPositionInCetusPoolEvent = async (
  event: CetusOpenPositionEventType
) => {
  try {
    const { parsedJson, sender, type, id, timestampMs } = event;

    if (type !== `${CETUS_PACKAGE_ADDRESS}::pool::OpenPositionEvent`) {
      throw new Error(`Invalid event type: ${type}`);
    }

    const { pool, position } = parsedJson;
    const poolObject = await client.getObject({
      id: pool,
      options: {
        showContent: true,
      },
    });

    const poolObjectData = poolObject.data;
    const content: CetusPoolContentType = poolObjectData.content as any;

    const poolType = content.type;
    const poolAssets = getPoolAssetsFromType(poolType);

    const tokenAType = poolAssets.split(",")[0];
    const tokenBType = poolAssets.split(",")[1];

    const tokenAMetadata = await client.getCoinMetadata({
      coinType: tokenAType,
    });
    const tokenBMetadata = await client.getCoinMetadata({
      coinType: tokenBType,
    });

    return {
      sender,
      pool,
      poolType,
      position,
      tokenAType,
      tokenBType,
      tokenAMetadata,
      tokenBMetadata,
      platform: "cetus",
      timestampMs,
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
      type !== `${CETUS_PACKAGE_ADDRESS}::pool::AddLiquidityEvent` ||
      type !== `${CETUS_PACKAGE_ADDRESS}::pool::RemoveLiquidityEvent`
    ) {
      throw new Error(`Invalid event type: ${type}`);
    }

    const { pool, position } = parsedJson;
    const poolObject = await client.getObject({
      id: pool,
      options: {
        showContent: true,
      },
    });

    const poolObjectData = poolObject.data;
    const content: CetusPoolContentType = poolObjectData.content as any;

    const poolType = content.type;
    const poolAssets = getPoolAssetsFromType(poolType);

    const tokenAType = poolAssets.split(",")[0];
    const tokenBType = poolAssets.split(",")[1];

    const tokenAMetadata = await client.getCoinMetadata({
      coinType: tokenAType,
    });
    const tokenBMetadata = await client.getCoinMetadata({
      coinType: tokenBType,
    });

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
      tokenAMetadata,
      tokenBMetadata,
      tokenAAmount,
      tokenBAmount,
      liquidityAmount,
      afterLiquidity,
      platform: "cetus",
      timestampMs,
      txnDigest: id.txDigest,
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
    const poolObject = await client.getObject({
      id: pool,
      options: {
        showContent: true,
      },
    });

    const poolObjectData = poolObject.data;
    const content: CetusPoolContentType = poolObjectData.content as any;

    const poolType = content.type;
    const poolAssets = getPoolAssetsFromType(poolType);

    const tokenAType = poolAssets.split(",")[0];
    const tokenBType = poolAssets.split(",")[1];

    const tokenAMetadata = await client.getCoinMetadata({
      coinType: tokenAType,
    });
    const tokenBMetadata = await client.getCoinMetadata({
      coinType: tokenBType,
    });

    const tokenAAmount = parsedJson.amount_a;
    const tokenBAmount = parsedJson.amount_b;

    return {
      sender,
      pool,
      poolType,
      position,
      tokenAType,
      tokenBType,
      tokenAMetadata,
      tokenBMetadata,
      tokenAAmount,
      tokenBAmount,
      platform: "cetus",
      timestampMs,
      txnDigest: id.txDigest,
      event: "collectLiquidityFee",
    };
  } catch (err) {
    console.log(err);
    return null;
  }
};
