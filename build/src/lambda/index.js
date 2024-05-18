import { firestore } from './utils/firebase.js';
import { getTradesSettledFromEvents } from './utils/getTradesSettledFromEvents.js';
export const handler = async (event) => {
    console.log(event);
    const txnEvents = event[0].body.events;
    const tradesExecuted = getTradesSettledFromEvents(txnEvents);
    console.log(`tradesExecuted: ${tradesExecuted}`);
    await Promise.all(Object.keys(tradesExecuted).map(async (userAddress) => {
        await firestore
            .collection('bluefin-users')
            .doc(userAddress)
            .collection('trades')
            .doc(event[0].body.digest)
            .set(tradesExecuted[userAddress]);
    }));
    const response = {
        statusCode: 200,
        body: JSON.stringify('Events saved to Firebase!'),
    };
    return response;
};
//# sourceMappingURL=index.js.map