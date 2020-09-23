declare namespace Components {
    namespace Parameters {
        namespace XRequestID {
            export type XRequestID = string;
        }
    }
    namespace Responses {
        export type HealthcheckResponse = Schemas.HealthcheckResponseBody;
    }
    namespace Schemas {
        export interface HealthcheckResponseBody {
            buildDate: string;
            buildSha: string;
            buildNumber: string;
        }
    }
}
declare namespace Paths {
    namespace ApiHealthcheck {
        namespace Get {
            namespace Responses {
                export type $200 = Components.Responses.HealthcheckResponse;
            }
        }
    }
}
