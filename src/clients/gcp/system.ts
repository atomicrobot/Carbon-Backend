import { ServerError } from '@models/error';
import { GoogleAuth } from 'google-auth-library';

export async function checkGCPConfiguration(): Promise<void | ServerError> {
    try {
        await new GoogleAuth().getCredentials()
        return;
    } catch (err) {
        return new ServerError('Server is not correctly configured to communicate with GCP', err.stack);
    }
}