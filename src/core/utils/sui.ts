import { SUI_RPC_ENDPOINT } from "../constants.js";
import { SuiHTTPTransport, SuiClient } from "@mysten/sui.js/client";

const client = new SuiClient({
  transport: new SuiHTTPTransport({
    url: SUI_RPC_ENDPOINT,
  }),
});

export async function queryTransaction(
  packageAddress: string,
  moduleLib: string,
  functionName: string,
  cursor: string | undefined | null,
  maxTxNumber: number
): Promise<any> {
  const response = await client.queryTransactionBlocks({
    cursor,
    limit: maxTxNumber,
    order: "ascending",
    filter: {
      MoveFunction: {
        package: packageAddress,
        module: moduleLib,
        function: functionName,
      },
    },
    options: {
      showEvents: true,
    },
  });

  return { ...response, moduleLib, functionName, packageAddress };
}

export async function queryEvents(
  packageAddress: string,
  moduleLib: string,
  cursor: {
    txDigest: string;
    eventSeq: string;
  },
  maxTxNumber: number
): Promise<any> {
  const response = await client.queryEvents({
    cursor,
    limit: maxTxNumber,
    order: "ascending",
    query: {
      MoveEventModule: {
        package: packageAddress,
        module: moduleLib,
      },
    },
  });

  return response;
}

export function cleanEventType(eventType: string): string {
  return eventType.substring(eventType.indexOf(":") + 2);
}
