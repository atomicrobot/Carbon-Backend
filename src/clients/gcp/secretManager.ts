import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

export async function loadSecret(secretResourceIdentifier: string): Promise<string | undefined> {
    const secretClient = new SecretManagerServiceClient();
    const [accessResponse] = await secretClient.accessSecretVersion({
        name: secretResourceIdentifier,
    });
    return accessResponse?.payload?.data?.toString();
}
