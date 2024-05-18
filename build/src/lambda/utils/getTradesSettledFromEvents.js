export const getTradesSettledFromEvents = (events) => {
    const tradesSettled = {};
    const positionUpdateEvents = events.filter((event) => event.type ===
        '0xcb4e1ee2a3d6323c70e7b06a8638de6736982cbdc08317d33e6f098747e2b438::position::AccountPositionUpdateEventV2');
    const tradesSettledEvents = events.filter((event) => event.type ===
        '0xcb4e1ee2a3d6323c70e7b06a8638de6736982cbdc08317d33e6f098747e2b438::isolated_trading::TradeExecutedV2');
    tradesSettledEvents.forEach((event) => {
        const parsedJson = event.parsedJson;
        const txnIndex = parsedJson.tx_index;
        const market = parsedJson.perpID;
        const maker = parsedJson.maker;
        const taker = parsedJson.taker;
        const makerPnl = !parsedJson.makerPnl.sign
            ? '-'
            : '' + parsedJson.makerPnl.value;
        const takerPnl = !parsedJson.takerPnl.sign
            ? '-'
            : '' + parsedJson.takerPnl.value;
        const positionSize = parsedJson.tradeQuantity;
        const tradePrice = parsedJson.tradePrice;
        const makerFee = parsedJson.makerFee;
        const takerFee = parsedJson.takerFee;
        const makersPositionUpdateEvent = positionUpdateEvents.find((event) => {
            const parsedJson = event.parsedJson;
            return (parsedJson.tx_index === txnIndex && parsedJson.position.user === maker);
        });
        const takersPositionUpdateEvent = positionUpdateEvents.find((event) => {
            const parsedJson = event.parsedJson;
            return (parsedJson.tx_index === txnIndex && parsedJson.position.user === taker);
        });
        const makerPosition = makersPositionUpdateEvent?.parsedJson;
        const takerPosition = takersPositionUpdateEvent?.parsedJson;
        const makerMargin = makerPosition?.position.margin;
        const takerMargin = takerPosition?.position.margin;
        const makersOrderFillEvent = events.find((event) => {
            const orderFillParsedJson = event.parsedJson;
            return (orderFillParsedJson.tx_index === txnIndex &&
                orderFillParsedJson.sigMaker === maker);
        });
        const takersOrderFillEvent = events.find((event) => {
            const orderFillParsedJson = event.parsedJson;
            return (orderFillParsedJson.tx_index === txnIndex &&
                orderFillParsedJson.sigMaker === taker);
        });
        const makersOrder = makersOrderFillEvent?.parsedJson;
        const takersOrder = takersOrderFillEvent?.parsedJson;
        const makerLeverage = makersOrder?.order.leverage;
        const takerLeverage = takersOrder?.order.leverage;
        const makerTradeType = makersOrder?.order.isBuy ? 'long' : 'short';
        const takerTradeType = takersOrder?.order.isBuy ? 'long' : 'short';
        tradesSettled[maker] = {
            perpId: market,
            userAddress: maker,
            feesPaid: (BigInt(tradesSettled[maker]?.feesPaid || 0) + BigInt(makerFee)).toString(),
            size: (BigInt(tradesSettled[maker]?.size || 0) + BigInt(positionSize)).toString(),
            averagePrice: tradePrice,
            margin: (BigInt(tradesSettled[maker]?.margin || 0) + BigInt(makerMargin)).toString(),
            pnl: (BigInt(tradesSettled[maker]?.pnl || 0) + BigInt(makerPnl)).toString(),
            leverage: makerLeverage,
            tradeType: makerTradeType,
        };
        tradesSettled[taker] = {
            perpId: market,
            userAddress: taker,
            feesPaid: (BigInt(tradesSettled[taker]?.feesPaid || 0) + BigInt(takerFee)).toString(),
            size: (BigInt(tradesSettled[taker]?.size || 0) + BigInt(positionSize)).toString(),
            averagePrice: tradePrice,
            margin: (BigInt(tradesSettled[taker]?.margin || 0) + BigInt(takerMargin)).toString(),
            pnl: (BigInt(tradesSettled[taker]?.pnl || 0) + BigInt(takerPnl)).toString(),
            leverage: takerLeverage,
            tradeType: takerTradeType,
        };
    });
    return tradesSettled;
};
//# sourceMappingURL=getTradesSettledFromEvents.js.map