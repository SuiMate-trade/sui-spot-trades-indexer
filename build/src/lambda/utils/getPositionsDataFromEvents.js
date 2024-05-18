import BigNumber from 'bignumber.js';
export const getPositionsDataFromEvents = (events) => {
    const currentPositions = {};
    const positionUpdateEvents = events.filter((event) => event.type ===
        '0xcb4e1ee2a3d6323c70e7b06a8638de6736982cbdc08317d33e6f098747e2b438::position::AccountPositionUpdateEventV2');
    const orderFillEvents = events.filter((event) => event.type ===
        '0xcb4e1ee2a3d6323c70e7b06a8638de6736982cbdc08317d33e6f098747e2b438::order::OrderFillV2');
    positionUpdateEvents.forEach((event) => {
        const parsedJson = event.parsedJson;
        const userAddress = parsedJson.position.user;
        const perpId = parsedJson.position.perpID;
        const margin = parsedJson.position.margin;
        const isPosPositive = parsedJson.position.isPosPositive;
        const oiOpen = parsedJson.position.oiOpen;
        const txnIndex = parsedJson.tx_index;
        const correspondingOrderFillEvent = orderFillEvents.find((orderFillEvent) => orderFillEvent.parsedJson.tx_index === txnIndex &&
            orderFillEvent.parsedJson.order.maker === userAddress);
        const orderFillParsedJson = correspondingOrderFillEvent?.parsedJson;
        const avgEntryPrice = orderFillParsedJson.fillPrice || '0';
        const orderSize = orderFillParsedJson.fillQty || '0';
        const leverage = orderFillParsedJson.order.leverage || '0';
        const isBuy = orderFillParsedJson.order.isBuy || false;
        const createdAt = Date.now();
        if (!currentPositions[userAddress]) {
            currentPositions[userAddress] = {};
        }
        const currentPositionSize = currentPositions[userAddress][perpId]?.size || '0';
        const newPositionSize = isBuy
            ? new BigNumber(currentPositionSize).plus(orderSize).toString()
            : new BigNumber(currentPositionSize).minus(orderSize).toString();
        currentPositions[userAddress][perpId] = {
            perpId,
            margin,
            isPosPositive,
            oiOpen,
            avgEntryPrice,
            createdAt,
            isBuy,
            size: newPositionSize,
            leverage,
            timestamp: Date.now() / 1000,
        };
    });
    return currentPositions;
};
//# sourceMappingURL=getPositionsDataFromEvents.js.map