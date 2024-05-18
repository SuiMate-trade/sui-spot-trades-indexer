export type PoolContentType = {
  dataType: string;
  type: string;
  fields?: // Cetus Pool fields type
  | {
        coin_a: string;
        coin_b: string;
        liquidity: string;
      }
    // Kriya Pool fields type
    | {
        token_x: string;
        token_y: string;
      };
};
