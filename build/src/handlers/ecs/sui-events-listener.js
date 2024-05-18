import { readSuiEvents } from '@/controllers/sui-listener-controller.js';
import { runTask } from '@/core/utils/ecs.js';
import { log } from '@/core/utils/logger.js';
import { handleScheduleRequest } from '@/core/utils/schedule.js';
import { sleep } from '@/core/utils/time.js';
import { ReadSuiEventsRequestModel } from '@/models/sui-models.js';
const DELAY_MS = 1000;
async function readSuiEventsLoop() {
    log('Start SUI listener.');
    /* eslint-disable no-constant-condition */
    while (true) {
        const request = new ReadSuiEventsRequestModel();
        await handleScheduleRequest(request, readSuiEvents);
        await sleep(DELAY_MS);
    }
}
const handler = async () => runTask(readSuiEventsLoop);
handler();
//# sourceMappingURL=sui-events-listener.js.map