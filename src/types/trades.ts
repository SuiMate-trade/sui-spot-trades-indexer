export type Trade = {
  userAddress: string;
  perpId: string;
  margin: string;
  pnl: string;
  size: string;
  averagePrice: string;
  feesPaid: string;
  leverage: string;
  tradeType: 'long' | 'short';
};
