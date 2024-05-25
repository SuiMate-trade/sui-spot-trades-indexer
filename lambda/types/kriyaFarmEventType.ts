export type KriyaFarmClaimEventType = {
  id: {
    txDigest: string;
    eventSeq: string;
  };
  packageId: string;
  transactionModule: string;
  sender: string;
  type: string;
  parsedJson: {
    claim_time: string;
    farm_id: string;
    reward_amount: string;
  };
  bcs: string;
  timestampMs: string;
};

export type KriyaFarmUnstakeEventType = {
  id: {
    txDigest: string;
    eventSeq: string;
  };
  packageId: string;
  transactionModule: string;
  sender: string;
  type: string;
  parsedJson: {
    end_time: string;
    farm_id: string;
    unstake_amount: string;
    unstake_weight: string;
  };
  bcs: string;
  timestampMs: string;
};

export type KriyaFarmStakeEventType = {
  id: {
    txDigest: string;
    eventSeq: string;
  };
  packageId: string;
  transactionModule: string;
  sender: string;
  type: string;
  parsedJson: {
    farm_id: string;
    stake_amount: string;
    stake_weight: string;
    start_time: string;
    lock_time: string;
  };
  bcs: string;
  timestampMs: string;
};
