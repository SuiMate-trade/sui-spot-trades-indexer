export type CetusOpenPositionEventType = {
  id: {
    txDigest: string;
    eventSeq: string;
  };
  packageId: string;
  transactionModule: string;
  sender: string;
  type: string;
  parsedJson: {
    pool: string;
    position: string;
    tick_lower: { bits: number };
    tick_upper: { bits: number };
  };
  bcs: string;
  timestampMs: string;
};

export type CetusAddOrRemoveLiquidityEventType = {
  id: {
    txDigest: string;
    eventSeq: string;
  };
  packageId: string;
  transactionModule: string;
  sender: string;
  type: string;
  parsedJson: {
    after_liquidity: string;
    amount_a: string;
    amount_b: string;
    liquidity: string;
    pool: string;
    position: string;
    tick_lower: { bits: number };
    tick_upper: { bits: number };
  };
  bcs: string;
  timestampMs: string;
};

export type CetusCollectLiquidityFeeEventType = {
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
    position: string;
  };
  bcs: string;
  timestampMs: string;
};
