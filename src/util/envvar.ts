import dotenv from 'dotenv';
import commandLineArgs from 'command-line-args';

export const loadPackagedEnvironmentVariables = () => {
    const options = commandLineArgs([
        {
            name: 'env',
            alias: 'e',
            defaultValue: 'production',
            type: String,
        },
    ]);

    const versionConfigResult = dotenv.config({
        path: `./env/build.env`
    });

    if (versionConfigResult.error) {
        throw versionConfigResult.error;
    }

    const envConfigResult = dotenv.config({
        path: `./env/${options.env}.env`,
    });

    if (envConfigResult.error) {
        throw envConfigResult.error;
    }
};

export const loadEnvironmentVariablesFromMemory = async (value: string) => {
    const parsed = dotenv.parse(value);
    for (const key of Object.keys(parsed)) {
        process.env[key] = parsed[key];
    }
};