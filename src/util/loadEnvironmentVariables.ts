import dotenv from 'dotenv';
import commandLineArgs from 'command-line-args';

export const loadPackagedEnvironmentVariables = async () => {
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
}
