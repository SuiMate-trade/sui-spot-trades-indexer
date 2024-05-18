export const sleep = (delayMs: number) =>
  // @ts-ignore
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, delayMs);
  });
