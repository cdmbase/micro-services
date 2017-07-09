import * as _ from 'lodash';
import * as Logger from 'bunyan';

let list: number[] = [];
let onGoingIntervalCount: number = 0;
let purging: Function | null = null;

export namespace IntervalHelper {
    export function getIntervalList() {
        return list;
    }

    export async function setIslandInterval(handler: Function, time) {
        const job = setInterval(async () => {
            onGoingIntervalCount++;
            await handler();
            if (--onGoingIntervalCount < 1 && purging) {
                purging();
            }
        }, time);
        await list.push(job);
        return job;
    }

    export async function purge(logger?: Logger) {
        logger && logger.info(`Island interval service purge`);
        if (list) {
            await Promise.all(_.map(list, (intervalHandler: number) => {
                clearInterval(intervalHandler);
            }));
            list = [];
        }
        if (onGoingIntervalCount) {
            return new Promise((res, rej) => { purging = res; });
        }
        logger && logger.info('Terminated interval', list);
        return Promise.resolve();
    }
}
