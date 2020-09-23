import { Logger, createLogger, format, transports } from 'winston';

const { Console } = transports;

export interface AppLogger {
    error(message: string, ...meta: any[]): void
    warn(message: string, ...meta: any[]): void
    info(message: string, ...meta: any[]): void
    verbose(message: string, ...meta: any[]): void
    debug(message: string, ...meta: any[]): void
}

export class WinstonLogger implements AppLogger {
    private readonly logger: Logger

    constructor(logger: Logger) {
        this.logger = logger
    }

    error(message: string, ...meta: any[]): void {
        this.logger.error(message, meta);
    }

    warn(message: string, ...meta: any[]): void {
        this.logger.warn(message, meta);
    }

    info(message: string, ...meta: any[]): void {
        this.logger.info(message, meta);
    }

    verbose(message: string, ...meta: any[]): void {
        this.logger.verbose(message, meta);
    }

    debug(message: string, ...meta: any[]): void {
        this.logger.debug(message, meta);
    }
}

export const buildConsoleLogger = () => {
    const logger = createLogger({
        level: 'info',
    });

    const errorStackFormat = format((info) => {
        if (info.stack) {
            // tslint:disable-next-line:no-console
            console.log(info.stack);
            return false;
        }

        return info;
    });

    const consoleTransport = new Console({
        format: format.combine(
            format.colorize(),
            format.simple(),
            errorStackFormat(),
        ),
    });

    logger.add(consoleTransport);

    return new WinstonLogger(logger);
};
