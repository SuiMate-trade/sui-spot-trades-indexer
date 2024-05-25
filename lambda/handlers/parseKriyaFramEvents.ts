import { KRIYA_FARM_PACKAGE_ADDRESS } from "../constants/index.js";
import {
  KriyaFarmClaimEventType,
  KriyaFarmStakeEventType,
  KriyaFarmUnstakeEventType,
} from "../types/kriyaFarmEventType.js";
import getPoolTokensMetadata from "../utils/getPoolTokensMetadata.js";

export const parseKriyaFarmClaimEvents = async (
  event: KriyaFarmClaimEventType
) => {
  try {
    const { parsedJson, sender, type, id, timestampMs } = event;

    if (!type.startsWith(`${KRIYA_FARM_PACKAGE_ADDRESS}::farm::ClaimEvent`)) {
      throw new Error(`Invalid event type: ${type}`);
    }

    const { claim_time, farm_id, reward_amount } = parsedJson;

    const { poolType, tokenAType, tokenBType } =
      await getPoolTokensMetadata(farm_id);

    return {
      sender,
      pool: farm_id,
      poolType,
      tokenAType,
      tokenBType,
      amount: reward_amount,
      timestampMs: parseInt(timestampMs),
      txnDigest: id.txDigest,
      claim_time,
      event: "farm_claim",
      platform: "kriya",
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const parseKriyaFarmUnstakeEvents = async (
  event: KriyaFarmUnstakeEventType
) => {
  try {
    const { parsedJson, sender, type, id, timestampMs } = event;

    if (!type.startsWith(`${KRIYA_FARM_PACKAGE_ADDRESS}::farm::UnstakeEvent`)) {
      throw new Error(`Invalid event type: ${type}`);
    }

    const { end_time, farm_id, unstake_amount, unstake_weight } = parsedJson;
    const { poolType, tokenAType, tokenBType } =
      await getPoolTokensMetadata(farm_id);

    return {
      sender,
      pool: farm_id,
      poolType,
      tokenAType,
      tokenBType,
      unstakeAmount: unstake_amount,
      unstakeWeight: unstake_weight,
      timestampMs: parseInt(timestampMs),
      txnDigest: id.txDigest,
      end_time,
      event: "farm_unstake",
      platform: "kriya",
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const parseKriyaFarmStakeEvents = async (
  event: KriyaFarmStakeEventType
) => {
  try {
    const { parsedJson, sender, type, id, timestampMs } = event;

    if (!type.startsWith(`${KRIYA_FARM_PACKAGE_ADDRESS}::farm::StakeEvent`)) {
      throw new Error(`Invalid event type: ${type}`);
    }

    const { farm_id, stake_amount, stake_weight } = parsedJson;
    const { poolType, tokenAType, tokenBType } =
      await getPoolTokensMetadata(farm_id);

    return {
      sender,
      pool: farm_id,
      poolType,
      tokenAType,
      tokenBType,
      stakeAmount: stake_amount,
      stakeWeight: stake_weight,
      timestampMs: parseInt(timestampMs),
      txnDigest: id.txDigest,
      event: "farm_stake",
      platform: "kriya",
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
