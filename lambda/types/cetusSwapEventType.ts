export type CetusSwapEventType = {
  id: {
    txDigest: string;
    eventSeq: string;
  };
  packageId: string;
  transactionModule: string;
  sender: string;
  type: string;
  parsedJson: {
    after_sqrt_price: string;
    amount_in: string;
    amount_out: string;
    atob: boolean;
    before_sqrt_price: string;
    fee_amount: string;
    partner: string;
    pool: string;
    ref_amount: string;
    steps: string;
    vault_a_amount: string;
    vault_b_amount: string;
  };
  bcs: string;
  timestampMs: string;
};
