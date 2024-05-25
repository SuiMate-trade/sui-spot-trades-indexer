export type TurbosSwapEventType = {
  id: {
    txDigest: string;
    eventSeq: string;
  };
  packageId: string;
  transactionModule: string;
  sender: string;
  type: string;
  parsedJson: {
    a_to_b: boolean;
    amount_a: string;
    amount_b: string;
    fee_amount: string;
    is_exact_in: boolean;
    liquidity: string;
    pool: string;
    protocol_fee: string;
    recipient: string;
    sqrt_price: string;
    tick_current_index: { bits: number };
    tick_pre_index: { bits: number };
  };
  bcs: string;
  timestampMs: string;
};
