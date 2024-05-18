import fetch from 'cross-fetch';
import { log, LogLevel } from './logger.js';
global.fetch = fetch;
export async function handleScheduleRequest(requestParams, handlerFunc) {
    try {
        const result = await handlerFunc(requestParams);
        log(`Handling of Scheduled event completed with result ${JSON.stringify(result)}`, LogLevel.INFO);
    }
    catch (error) {
        log('Scheduled handler execution failed.', LogLevel.ERROR);
        log(error, LogLevel.ERROR);
    }
}
//# sourceMappingURL=schedule.js.map