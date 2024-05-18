export const sleep = (delayMs) => 
// @ts-ignore
new Promise((resolve) => {
    setTimeout(() => {
        resolve();
    }, delayMs);
});
//# sourceMappingURL=time.js.map