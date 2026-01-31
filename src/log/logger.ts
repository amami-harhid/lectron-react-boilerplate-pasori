import logger from 'electron-log';

export interface ILogger {
    info: CallableFunction;
    debug: CallableFunction;
    warn: CallableFunction;
    error: CallableFunction;
}

export class Logger implements ILogger {
    info(...args: any[]) {
        logger.info(args);
    }
    debug(...args: any[]) {
        if(process.env.DEBUG_PROD === 'true'){
            logger.debug(args);
        }
    }
    warn(...args: any[]) {
        logger.warn(args);
    }
    error(...args: any[]) {
        logger.error(args);
    }
}