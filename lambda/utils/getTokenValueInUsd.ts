import { type CoinMetadata } from "@mysten/sui.js/client";
import BigNumber from "bignumber.js";
import cache from "./cache.js";
import getPriceDataAtTimestamp from "./getPriceDataAtTimestamp.js";
import client from "./sui.js";

const getTokenValueInUsd = async (
  tokenType: string,
  amount: string,
  timestampMs: number
) => {
  try {
    let tokenMetadata: CoinMetadata;

    if (cache.get(tokenType)) {
      tokenMetadata = cache.get(tokenType);
    } else {
      tokenMetadata = await client.getCoinMetadata({
        coinType: tokenType,
      });

      cache.set(tokenType, tokenMetadata);
    }

    const tokenAmount = BigNumber(amount).dividedBy(
      BigNumber(10 ** tokenMetadata.decimals)
    );

    let priceInUSD = "0";

    if (cache.get(`price-${tokenMetadata.symbol}-${timestampMs}`)) {
      priceInUSD = cache.get(`price-${tokenMetadata.symbol}-${timestampMs}`);
    } else {
      priceInUSD = await getPriceDataAtTimestamp(
        Math.floor(timestampMs / 1000),
        tokenMetadata.symbol
      );

      cache.set(`price-${tokenMetadata.symbol}-${timestampMs}`, priceInUSD);
    }

    const valueInUSD = priceInUSD
      ? tokenAmount.multipliedBy(BigNumber(priceInUSD))
      : BigNumber(0);

    return valueInUSD;
  } catch (e) {
    console.error(e);
    return BigNumber(0);
  }
};

export default getTokenValueInUsd;
