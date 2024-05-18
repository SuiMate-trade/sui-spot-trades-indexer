import { log, LogLevel } from './logger.js';
export async function runTask(task) {
    try {
        log(`Start executing task ${task.name}`);
        await task();
    }
    catch (error) {
        log('ECS task handler execution failed.', LogLevel.ERROR);
        log(error, LogLevel.ERROR);
    }
}
//# sourceMappingURL=ecs.js.map