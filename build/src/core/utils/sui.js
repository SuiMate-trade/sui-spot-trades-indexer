import { SUI_RPC_ENDPOINT } from '../constants.js';
import { SuiHTTPTransport, SuiClient } from '@mysten/sui.js/client';
const client = new SuiClient({
    transport: new SuiHTTPTransport({
        url: SUI_RPC_ENDPOINT,
    }),
});
export async function queryTransaction(packageAddress, moduleLib, functionName, cursor, maxTxNumber) {
    const response = await client.queryTransactionBlocks({
        cursor,
        limit: maxTxNumber,
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
    return response;
}
export async function queryEvents(packageAddress, moduleLib, functionName, cursor, maxTxNumber) {
    const response = await fetch(SUI_RPC_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'suix_queryEvents',
            params: [
                {
                    MoveModule: {
                        package: packageAddress,
                        module: moduleLib,
                        function: functionName,
                    },
                },
                cursor,
                maxTxNumber,
            ],
        }),
    });
    const responseObject = await response.json();
    return responseObject.result;
}
export function cleanEventType(eventType) {
    return eventType.substring(eventType.indexOf(':') + 2);
}
//# sourceMappingURL=sui.js.map