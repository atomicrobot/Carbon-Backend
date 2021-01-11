import { Request } from 'express';
import { AppDependencies } from '@app/config';

declare global {
    namespace Express {
        interface Application {
            dependencies: AppDependencies;
        }

        interface Request {
            metadata: RequestMetadata;
        }
    }
}

export interface RequestMetadata {
    language: string;
}

export function buildRequestMetadata(req: Request): RequestMetadata {
    return {
        language: req.headers['accept-language'] ?? 'en',
    };
}
