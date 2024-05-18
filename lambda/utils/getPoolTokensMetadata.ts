import { PoolContentType } from "../types/poolContentType.js";
import { getPoolAssetsFromType } from "./getPoolAssetsFromType.js";
import client from "./sui.js";

const getPoolTokensMetadata = async (poolId: string) => {
  try {
    const poolObject = await client.getObject({
      id: poolId,
      options: {
        showContent: true,
      },
    });

    const poolObjectData = poolObject.data;
    const content: PoolContentType = poolObjectData.content as any;

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
      tokenAMetadata,
      tokenBMetadata,
      content,
      poolType,
      tokenAType,
      tokenBType,
    };
  } catch (err) {
    console.log(err);
    throw new Error("Error getting pool tokens metadata");
  }
};

export default getPoolTokensMetadata;
