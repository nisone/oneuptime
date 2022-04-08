import express, {
    ExpressRequest,
    ExpressResponse,
} from 'common-server/utils/Express';
const router = express.getRouter();
const getUser = require('../middlewares/user').getUser;
import BadDataException from 'common/types/exception/BadDataException';
import { isAuthorized } from '../middlewares/authorization';
import {
    sendErrorResponse,
    sendItemResponse,
} from 'common-server/utils/response';
import Exception from 'common/types/exception/Exception';

import { sendListResponse } from 'common-server/utils/response';
import IncidentSettingsService from '../services/incidentSettingsService';
import IncidentPrioritiesService from '../services/incidentPrioritiesService';

import { variables } from '../config/incidentDefaultSettings';

router.get('/variables', async (req: ExpressRequest, res: ExpressResponse) => {
    try {
        return sendItemResponse(req, res, variables);
    } catch (error) {
        return sendErrorResponse(req, res, error as Exception);
    }
});

// fetch default incident template in a project
router.get(
    '/:projectId/default',
    getUser,
    isAuthorized,
    async function (req, res) {
        try {
            const { projectId } = req.params;
            if (!projectId) {
                const error = new Error('Project Id must be present');

                error.code = 400;
                throw error;
            }
            const select =
                'projectId title description incidentPriority isDefault name createdAt';

            const query = { projectId, isDefault: true };
            const template = await IncidentSettingsService.findOne({
                query,
                select,
            });

            return sendItemResponse(req, res, template);
        } catch (error) {
            return sendErrorResponse(req, res, error as Exception);
        }
    }
);

// fetch all incident template in a project
router.get(
    '/:projectId',
    getUser,
    isAuthorized,
    async (req: ExpressRequest, res: ExpressResponse) => {
        try {
            const { projectId } = req.params;
            const { skip, limit } = req.query;

            if (!projectId) {
                const error = new Error('Project Id must be present');

                error.code = 400;
                throw error;
            }

            const query = { projectId };
            const populate = [
                { path: 'incidentPriority', select: 'name color' },
            ];
            const select =
                'projectId title description incidentPriority isDefault name createdAt';
            const [templates, count] = await Promise.all([
                IncidentSettingsService.findBy({
                    query,
                    limit,
                    skip,
                    select,
                    populate,
                }),
                IncidentSettingsService.countBy(query),
            ]);

            return sendListResponse(req, res, templates, count);
        } catch (error) {
            return sendErrorResponse(req, res, error as Exception);
        }
    }
);

router.put(
    '/:projectId/:templateId/setDefault',
    getUser,
    isAuthorized,
    async (req: ExpressRequest, res: ExpressResponse) => {
        const { projectId, templateId } = req.params;
        if (!projectId)
            return sendErrorResponse(
                req,
                res,
                new BadDataException('Project Id must be present.')
            );

        try {
            const defaultPrioritySetting =
                await IncidentSettingsService.updateOne(
                    {
                        _id: templateId,
                        projectId,
                    },
                    {
                        isDefault: true,
                    }
                );
            return sendItemResponse(req, res, defaultPrioritySetting);
        } catch (error) {
            return sendErrorResponse(req, res, error as Exception);
        }
    }
);

router.put(
    '/:projectId/:templateId',
    getUser,
    isAuthorized,
    async function (req, res) {
        const { projectId, templateId } = req.params;
        const { title, description, incidentPriority, isDefault, name } =
            req.body;
        if (!projectId)
            return sendErrorResponse(
                req,
                res,
                new BadDataException('Project Id must be present.')
            );

        if (!templateId)
            return sendErrorResponse(
                req,
                res,
                new BadDataException('Incident settings Id must be present.')
            );

        if (!name) {
            return sendErrorResponse(
                req,
                res,
                new BadDataException('Name must be present')
            );
        }

        if (!title)
            return sendErrorResponse(
                req,
                res,
                new BadDataException('Title must be present.')
            );

        if (!incidentPriority)
            return sendErrorResponse(
                req,
                res,
                new BadDataException('Incident priority must be present.')
            );

        try {
            //Update should not happen if the incident priority is remove and doesn't exist.
            const priority = await IncidentPrioritiesService.countBy({
                _id: incidentPriority,
            });

            if (!priority || priority === 0)
                return sendErrorResponse(req, res, {
                    code: 400,
                    message: "Incident priority doesn't exist.",
                });

            const incidentSettings = await IncidentSettingsService.updateOne(
                {
                    projectId,
                    _id: templateId,
                },
                {
                    title,
                    description,
                    incidentPriority,
                    isDefault,
                    name,
                }
            );
            return sendItemResponse(req, res, incidentSettings);
        } catch (error) {
            return sendErrorResponse(req, res, error as Exception);
        }
    }
);

router.delete(
    '/:projectId/:templateId',
    getUser,
    isAuthorized,
    async function (req, res) {
        try {
            const { projectId, templateId } = req.params;

            if (!projectId) {
                const error = new Error('Project Id must be present');

                error.code = 400;
                throw error;
            }
            if (!templateId) {
                const error = new Error(
                    'Incident settings Id must be present.'
                );

                error.code = 400;
                throw error;
            }

            const incidentSetting = await IncidentSettingsService.deleteBy({
                _id: templateId,
                projectId,
            });
            return sendItemResponse(req, res, incidentSetting);
        } catch (error) {
            return sendErrorResponse(req, res, error as Exception);
        }
    }
);

router.post(
    '/:projectId',
    getUser,
    isAuthorized,
    async (req: ExpressRequest, res: ExpressResponse) => {
        try {
            const { projectId } = req.params;
            // description is optional
            const {
                title,
                description,
                incidentPriority,
                isDefault = false,
                name,
            } = req.body;

            if (!projectId) {
                const error = new Error('Project Id must be present');

                error.code = 400;
                throw error;
            }
            if (!name) {
                const error = new Error('Name must be present');

                error.code = 400;
                throw error;
            }
            if (!title) {
                const error = new Error('Title must be present');

                error.code = 400;
                throw error;
            }
            if (!incidentPriority) {
                const error = new Error('Incident priority must be present');

                error.code = 400;
                throw error;
            }

            const priority = await IncidentPrioritiesService.findOne({
                query: { _id: incidentPriority },
                select: '_id',
            });
            if (!priority) {
                const error = new Error("Incident priority doesn't exist.");

                error.code = 400;
                throw error;
            }

            const data = {
                projectId,
                title,
                description,
                incidentPriority,
                isDefault,
                name,
            };
            const incidentSetting = await IncidentSettingsService.create(data);

            return sendItemResponse(req, res, incidentSetting);
        } catch (error) {
            return sendErrorResponse(req, res, error as Exception);
        }
    }
);

export default router;