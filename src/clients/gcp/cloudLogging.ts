import { createLogger, format } from 'winston';
import correlator from 'express-correlation-id';
import { AppConfig } from '@util/app';
import { WinstonLogger } from '@util/logger';
import { LoggingWinston } from '@google-cloud/logging-winston';

// Due to https://github.com/winstonjs/winston/issues/1660
const fixErrors = format(info => {
    // Only modify the info it there was an error
    if (info.stack === undefined) {
        return info;
    }

    const { message } = info;
    const splatSymbol = Symbol.for('splat') as any;

    // Get the original error message
    const errorMessage =
        info[splatSymbol] &&
        info[splatSymbol][0] &&
        info[splatSymbol][0].message;

    // Check that the original error message was concatenated to the message
    if (errorMessage === undefined ||
        message.length <= errorMessage.length ||
        !message.endsWith(errorMessage)) {
        return info;
    }

    // Slice off the original error message from the log message
    info.message = message.slice(0, errorMessage.length * -1);

    return info;
});

// See: https://cloud.google.com/error-reporting/docs/formatting-error-messages#json_representation
const formatForGCP = format(info => {
    if (info.stack) {
        info.exception = info.stack;
        delete info.stack;
    }

    return info;
});

const logCorrelationId = format(info => {
    const id = correlator.getId();
    if (id) {
        info['x-request-id'] = id;
    }

    return info;
});

export const buildCloudLoggingLogger = async (config: AppConfig) => {
    const logger = createLogger({
        format: format.combine(
            format.splat(),
            fixErrors(),
            formatForGCP(),
            logCorrelationId()
        ),
        transports: [
            new LoggingWinston({
                logName: config.logName,
                serviceContext: {
                    service: config.serviceName,
                    version: config.buildNumber
                }
            }),
        ],
    });

    return new WinstonLogger(logger);
};
