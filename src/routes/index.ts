import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import '@models/openapi'

const router = Router();

router.use('/api/healthcheck', (req, res) => {
    res.status(StatusCodes.OK).send({
        buildDate: req.app.dependencies.config.buildDate,
        buildSha: req.app.dependencies.config.buildSha,
        buildNumber: req.app.dependencies.config.buildNumber
    } as Components.Schemas.HealthcheckResponseBody);
});

export default router;
