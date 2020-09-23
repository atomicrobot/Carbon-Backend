import dotenv from 'dotenv';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

export const loadExternalEnvironmentVariables = async () => {
    if (process.env.GCP_SECRET_MANAGER_CONFIG_RESOURCE_ID === undefined) {
        return;
    }

    const secretClient = new SecretManagerServiceClient();
    if (process.env.GCP_SECRET_MANAGER_CONFIG_RESOURCE_ID) {
        const [accessResponse] = await secretClient.accessSecretVersion({
            name: process.env.GCP_SECRET_MANAGER_CONFIG_RESOURCE_ID,
        });

        const secretPayload = accessResponse?.payload?.data?.toString();
        if (secretPayload) {
            const buf = Buffer.from(secretPayload);
            const parsed = dotenv.parse(buf);
            for (const key of Object.keys(parsed)) {
                process.env[key] = parsed[key];
            }
        }
    }
}
