import { rtdb } from '@/core/utils/firebase.js';
export class BaseRtdbRepository {
    dbRef;
    constructor() {
        this.dbRef = rtdb.ref();
    }
    async get(ref) {
        const snapshot = await this.dbRef.child(ref).get();
        if (snapshot.exists()) {
            return snapshot.val();
        }
        else {
            console.log('No data available for ref: ' + ref);
            return null;
        }
    }
    async put(ref, data) {
        await this.dbRef.child(ref).set(data);
        return data;
    }
    async update(updates) {
        await this.dbRef.update(updates);
    }
}
const baseRtdbRepository = new BaseRtdbRepository();
export default baseRtdbRepository;
//# sourceMappingURL=BaseRtdbRepository.js.map