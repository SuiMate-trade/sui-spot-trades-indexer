import { CoinMetadata } from "@mysten/sui.js/client";
import BigNumber from "bignumber.js";
import getPriceDataAtTimestamp from "./getPriceDataAtTimestamp.js";

const getTokenValueInUsd = async (
  tokenMetadata: CoinMetadata,
  amount: string,
  timestampMs: string
) => {
  try {
    const tokenAmount = BigNumber(amount).dividedBy(
      10 ** tokenMetadata.decimals
    );
    const priceInUSD = await getPriceDataAtTimestamp(
      Math.floor(parseInt(timestampMs) / 1000),
      tokenMetadata.symbol
    );

    const valueInUSD = priceInUSD
      ? tokenAmount.multipliedBy(priceInUSD)
      : BigNumber(0);

    return valueInUSD;
  } catch (e) {
    console.error(e);
    return BigNumber(0);
  }
};

export default getTokenValueInUsd;
