import { type SuiObjectResponse } from "@mysten/sui.js/client";
import { PoolContentType } from "../types/poolContentType.js";
import cache from "./cache.js";
import { getPoolAssetsFromType } from "./getPoolAssetsFromType.js";
import client from "./sui.js";

const getPoolTokensMetadata = async (poolId: string) => {
  try {
    let poolObject: SuiObjectResponse;

    if (cache.get(poolId)) {
      poolObject = cache.get(poolId);
    } else {
      poolObject = await client.getObject({
        id: poolId,
        options: {
          showContent: true,
        },
      });

      cache.set(poolId, poolObject);
    }

    const poolObjectData = poolObject.data;
    const content: PoolContentType = poolObjectData.content as any;

    const poolType = content.type;
    const poolAssets = getPoolAssetsFromType(poolType);

    const tokenAType = poolAssets.split(",")[0];
    const tokenBType = poolAssets.split(",")[1];

    return {
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
