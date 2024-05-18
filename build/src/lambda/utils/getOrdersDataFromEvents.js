export const getOrdersDataFromEvents = (events) => {
    const orders = {};
    const orderFillEvents = events.filter((event) => event.type ===
        '0xcb4e1ee2a3d6323c70e7b06a8638de6736982cbdc08317d33e6f098747e2b438::order::OrderFillV2');
    orderFillEvents.forEach((event) => {
        const userAddress = event.parsedJson.order.maker;
        const perpId = event.parsedJson.order.market;
        const txnIndex = event.parsedJson.tx_index;
        const isBuy = event.parsedJson.order.isBuy;
        const leverage = event.parsedJson.order.leverage;
        const executionPrice = event.parsedJson.order.price;
        const size = event.parsedJson.order.quantity;
        const correspondingTradeEvent = events.find((event) => event.type ===
            '0xcb4e1ee2a3d6323c70e7b06a8638de6736982cbdc08317d33e6f098747e2b438::isolated_trading::TradeExecutedV2' &&
            event.parsedJson.tx_index === txnIndex);
        let pnl = '';
        if (isBuy) {
            const pnlObject = correspondingTradeEvent.parsedJson.takerPnl;
            pnl = pnlObject.value;
            if (!pnlObject.sign) {
                pnl = '-' + pnl;
            }
        }
        else {
            const pnlObject = correspondingTradeEvent.parsedJson.makerPnl;
            pnl = pnlObject.value;
            if (!pnlObject.sign) {
                pnl = '-' + pnl;
            }
        }
        if (!orders[userAddress]) {
            orders[userAddress] = [];
        }
        orders[userAddress].push({
            perpId,
            isBuy,
            leverage,
            executionPrice,
            size,
            txnIndex,
            pnl,
            timestamp: Date.now() / 1000,
        });
    });
    return orders;
};
//# sourceMappingURL=getOrdersDataFromEvents.js.map