export type KriyaSwapEventType = {
  id: {
    txDigest: string;
    eventSeq: string;
  };
  packageId: string;
  transactionModule: string;
  sender: string;
  type: string;
  parsedJson: {
    amount_in: string;
    amount_out: string;
    pool_id: string;
    reserve_x: string;
    reserve_y: string;
    user: string;
  };
  bcs: string;
  timestampMs: string;
};

export type KriyaAddLiquidityEventType = {
  id: {
    txDigest: string;
    eventSeq: string;
  };
  packageId: string;
  transactionModule: string;
  sender: string;
  type: string;
  parsedJson: {
    amount_x: string;
    amount_y: string;
    liquidity_provider: string;
    lsp_minted: string;
    pool_id: string;
  };
  bcs: string;
  timestampMs: string;
};
