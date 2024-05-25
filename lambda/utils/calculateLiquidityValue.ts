import BigNumber from "bignumber.js";
import getTokenValueInUsd from "./getTokenValueInUsd";

export const calculateLiquidityValue = async (
  tokenAType: string,
  tokenAAmount: string,
  tokenBType: string,
  tokenBAmount: string,
  timestampMs: number
) => {
  try {
    const valueInUSDTokenA = await getTokenValueInUsd(
      tokenAType,
      tokenAAmount,
      timestampMs
    );
    const valueInUSDTokenB = await getTokenValueInUsd(
      tokenBType,
      tokenBAmount,
      timestampMs
    );

    const totalValue = valueInUSDTokenA.plus(valueInUSDTokenB).decimalPlaces(2);
    return totalValue;
  } catch (error) {
    return BigNumber(0);
  }
};
