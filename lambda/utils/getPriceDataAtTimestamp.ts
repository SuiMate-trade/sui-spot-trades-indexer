import axios from "axios";
import BigNumber from "bignumber.js";
import PythPriceFeeds from "../constants/pythPriceFeedIds";

const getPriceDataAtTimestamp = async (
  timestamp: number,
  tokenSymbol: string,
  isRetry?: boolean
) => {
  try {
    const pythPriceFeedIdForToken = PythPriceFeeds.find(
      (feed) => feed.attributes.base.toLowerCase() === tokenSymbol.toLowerCase()
    )?.id;

    if (!pythPriceFeedIdForToken) {
      return null;
    }

    const priceDataResponse = await axios.get(
      `https://benchmarks.pyth.network/v1/updates/price/${timestamp}?ids=${pythPriceFeedIdForToken}&encoding=hex&parsed=true`
    );

    if (priceDataResponse.status !== 200) {
      return "0";
    }

    const price = priceDataResponse.data.parsed[0]?.price?.price as string;

    return BigNumber(price)
      .dividedBy(BigNumber(10 ** 8))
      .toString();
  } catch (err) {
    if (!isRetry) {
      return getPriceDataAtTimestamp(1696155454, tokenSymbol, true);
    }
    return "0";
  }
};

export default getPriceDataAtTimestamp;
