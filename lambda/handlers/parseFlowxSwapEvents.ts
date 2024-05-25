import { FLOWX_PACKAGE_ADDRESS } from "../constants/index";
import { FlowxSwapEventType } from "../types/flowxSwapEventType";
import client from "../utils/sui";

export const parseFlowxSwapEvents = async (event: FlowxSwapEventType) => {
  try {
    const { parsedJson, sender, type, id, timestampMs } = event;

    if (type !== `${FLOWX_PACKAGE_ADDRESS}::pair::Swapped`) {
      throw new Error(`Invalid event type: ${type}`);
    }

    const {
      amount_x_in,
      amount_x_out,
      amount_y_in,
      amount_y_out,
      coin_x,
      coin_y,
    } = parsedJson;

    const tokenAType = coin_x;
    const tokenBType = coin_y;

    const tokenAMetadata = await client.getCoinMetadata({
      coinType: tokenAType,
    });
    const tokenBMetadata = await client.getCoinMetadata({
      coinType: tokenBType,
    });

    const amountIn = amount_x_in !== "0" ? amount_x_in : amount_y_in;
    const amountOut = amount_x_out !== "0" ? amount_x_out : amount_y_out;

    const atob = amount_x_in !== "0";

    return {
      sender,
      tokenAMetadata,
      tokenBMetadata,
      tokenAType,
      tokenBType,
      amountIn,
      amountOut,
      platform: "flowx",
      timestampMs: parseInt(timestampMs),
      atob,
      fees: "0",
      txnDigest: id.txDigest,
      event: "swap",
    };
  } catch (error) {
    console.error("Error parsing Flowx Swap events", error);
    return null;
  }
};
