import pino, { Level, BaseLogger } from 'pino';

export { BaseLogger as Logger } from 'pino';

const levelToSeverity: Record<string, string> = {
    fatal: 'CRITICAL',
    error: 'ERROR',
    warn: 'WARNING',
    info: 'INFO',
    trace: 'DEBUG',
    debug: 'DEBUG',
};

export function buildLogger(options?: {
    env?: {
        SERVICE_NAME: string;
        SERVICE_VERSION: string;
        LOGGER: string;
        LOG_LEVEL: string;
    };
}): BaseLogger {
    const logger = options?.env?.LOGGER;
    const level = options?.env?.LOG_LEVEL ?? 'info';

    let instance: BaseLogger;
    if (logger === 'console') {
        instance = pino({
            level,
            transport: {
                target: 'pino-pretty',
                options: {
                    translateTime: 'HH:MM:ss:l Z',
                    ignore: 'pid,hostname',
                },
            },
            serializers: {
                req: (req) => {
                    return {
                        id: req.id,
                        method: req.method,
                        url: req.url,
                    };
                },
                err: (err) => {
                    return pino.stdSerializers.err(err);
                },
                res: (reply) => {
                    return {
                        id: reply.request.id,
                        statusCode: reply.statusCode,
                    };
                },
            },
        });
    } else {
        instance = pino({
            level,
            base: {
                serviceName: options?.env?.SERVICE_NAME || '',
                version: options?.env?.SERVICE_VERSION || '',
            },
            formatters: {
                level(label: string) {
                    const level = label as Level;
                    const severity = levelToSeverity[level] ?? 'INFO';
                    return { severity };
                },
            },
            messageKey: 'message',
        });
    }

    // Needed for Fastify
    // See fastify/lib/logger.js in https://github.com/fastify/fastify
    instance.child = (): BaseLogger => instance;

    return instance;
}

declare module 'pino' {
    export class BaseLogger {
        child(bindings: Bindings, options?: ChildLoggerOptions): BaseLogger;
    }
}
