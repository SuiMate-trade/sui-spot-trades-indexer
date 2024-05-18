import axios from "axios";
import PythPriceFeeds from "../constants/pythPriceFeedIds";

const getPriceDataAtTimestamp = async (
  timestamp: number,
  tokenSymbol: string
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
      return null;
    }

    return priceDataResponse.data.parsed[0].price.price as string;
  } catch (err) {
    return null;
  }
};

export default getPriceDataAtTimestamp;
