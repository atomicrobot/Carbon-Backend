
/**
 * @swagger
 * components:
 *   schemas:
 *     HealthcheckResponseBody:
 *       type: object
 *       properties:
 *         buildDate:
 *           type: string
 *         buildSha:
 *           type: string
 *         buildNumber:
 *           type: string
 *       required:
 *         - buildDate
 *         - buildSha
 *         - buildNumber
 *       additionalProperties: false
 */
export interface HealthcheckResponseBody {
	buildDate: string;
	buildSha: string;
	buildNumber: string;
}