import { createLogger, format } from 'winston';
import { Format } from 'logform'
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

export interface BuilderOptions {
    logName: string,
    serviceName: string,
    version: string,
    formats: Format[]
};

export const buildCloudLoggingLogger = (options: BuilderOptions) => {
    const formats = [
        format.splat(),
        fixErrors(),
        formatForGCP(),
    ].concat(options.formats);

    return createLogger({
        format: format.combine(...formats),
        transports: [
            new LoggingWinston({
                logName: options.logName,
                serviceContext: {
                    service: options.serviceName,
                    version: options.version
                }
            }),
        ],
    });
};
