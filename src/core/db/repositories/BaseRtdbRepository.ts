import { rtdb } from '@/core/utils/firebase.js';
import { Reference } from 'firebase-admin/database';

export class BaseRtdbRepository {
  protected dbRef: Reference;

  constructor() {
    this.dbRef = rtdb.ref();
  }

  public async get(ref: string) {
    const snapshot = await this.dbRef.child(ref).get();
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log('No data available for ref: ' + ref);
      return null;
    }
  }

  public async put(
    ref: string,
    data: Record<string, string | number | boolean>,
  ) {
    await this.dbRef.child(ref).set(data);
    return data;
  }

  public async update(updates: {
    [ref: string]: Record<string, string | number | boolean>;
  }) {
    await this.dbRef.update(updates);
  }
}

const baseRtdbRepository = new BaseRtdbRepository();
export default baseRtdbRepository;
