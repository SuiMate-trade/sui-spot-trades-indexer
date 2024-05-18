export type PositionUpdateEvent = {
  action: number;
  position: {
    index: {
      timestamp: string;
      value: { sign: boolean; value: string };
    };
    isPosPositive: boolean;
    margin: string;
    mro: string;
    oiOpen: string;
    perpID: string;
    qPos: string;
    user: string;
  };
  sender: string;
  tx_index: string;
};

export type OrderFillEvent = {
  fillPrice: string;
  fillQty: string;
  newFilledQuantity: string;
  order: {
    expiration: string;
    flags: number;
    ioc: boolean;
    isBuy: boolean;
    leverage: string;
    maker: string;
    market: string;
    orderbookOnly: boolean;
    postOnly: boolean;
    price: string;
    quantity: string;
    reduceOnly: boolean;
    salt: string;
  };
  orderHash: number[];
  sigMaker: string;
  tx_index: string;
};

export type TradeExecutedEvent = {
  isBuy: boolean;
  maker: string;
  makerFee: string;
  makerMRO: string;
  makerOrderHash: number[];
  makerPnl: { sign: boolean; value: string };
  perpID: string;
  sender: string;
  taker: string;
  takerFee: string;
  takerMRO: string;
  takerOrderHash: number[];
  takerPnl: { sign: boolean; value: string };
  tradePrice: string;
  tradeQuantity: string;
  tradeType: number;
  tx_index: string;
};

export type BankBalanceUpdateEvent = {
  action: string;
  amount: string;
  destAddress: string;
  destBalance: string;
  srcAddress: string;
  srcBalance: string;
  tx_index: string;
};
