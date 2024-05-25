export type FlowxSwapEventType = {
  id: {
    txDigest: string;
    eventSeq: string;
  };
  packageId: string;
  transactionModule: string;
  sender: string;
  type: string;
  parsedJson: {
    amount_x_in: string;
    amount_x_out: string;
    amount_y_in: string;
    amount_y_out: string;
    coin_x: string;
    coin_y: string;
    user: string;
  };
  bcs: string;
  timestampMs: string;
};
