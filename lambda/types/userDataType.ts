export type UserDataType = {
  totalVolumeSwapped: number;
  lastTradedTimestampMs: number;
  totalLiquidityProvided: number;
  liquidityFeesCollected: number;
  totalStaked: number;
  totalSwapsMade: number;
  lastSwapTimestampMs: number;
  lastLiquidityProvidedTimestampMs: number;
  swapData: {
    [key: string]: {
      totalVolumeSwapped: number;
      totalSwapsMade: number;
    };
  };
};
