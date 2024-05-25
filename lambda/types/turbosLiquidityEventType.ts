export type TurbosCollectLiquidityFeeEventType = {
  id: {
    txDigest: string;
    eventSeq: string;
  };
  packageId: string;
  transactionModule: string;
  sender: string;
  type: string;
  parsedJson: {
    amount_a: string;
    amount_b: string;
    pool: string;
    recipient: string;
    tick_lower_index: { bits: number };
    tick_upper_index: { bits: number };
  };
  bcs: string;
  timestampMs: string;
};

export type TurbosAddOrRemoveLiquidityToPoolEventType = {
  id: {
    txDigest: string;
    eventSeq: string;
  };
  packageId: string;
  transactionModule: string;
  sender: string;
  type: string;
  parsedJson: {
    amount_a: string;
    amount_b: string;
    liquidity_delta: string;
    owner: string;
    pool: string;
    tick_lower_index: { bits: number };
    tick_upper_index: { bits: number };
  };
  bcs: string;
  timestampMs: string;
};
