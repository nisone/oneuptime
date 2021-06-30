/**
 *
 * Copyright HackerBay, Inc.
 *
 */

const express = require('express');
const router = express.Router();

const AutomatedScriptService = require('../services/automatedScriptService');
const sendErrorResponse = require('../middlewares/response').sendErrorResponse;
const sendListResponse = require('../middlewares/response').sendListResponse;
const { sendItemResponse } = require('../middlewares/response');
const { isAuthorized } = require('../middlewares/authorization');
const { getUser } = require('../middlewares/user');

router.get('/:projectId', getUser, isAuthorized, async function(req, res) {
    try {
        const { projectId } = req.params;
        const { skip, limit } = req.query;
        const scripts = await AutomatedScriptService.findBy(
            { projectId },
            skip,
            limit
        );
        const count = await AutomatedScriptService.countBy({ projectId });
        return sendListResponse(req, res, scripts, count);
    } catch (error) {
        return sendErrorResponse(req, res, error);
    }
});

router.get(
    '/:projectId/:automatedSlug',
    getUser,
    isAuthorized,
    async (req, res) => {
        try {
            const { automatedSlug } = req.params;
            const { skip, limit } = req.query;
            const details = await AutomatedScriptService.findOneBy({
                slug: automatedSlug,
            });
            const logs = await AutomatedScriptService.getAutomatedLogs(
                {
                    automationScriptId: details._id,
                },
                skip,
                limit
            );

            if (details.successEvent.length > 0) {
                details.successEvent = formatEvent(details.successEvent);
            }

            if (details.failureEvent.length > 0) {
                details.failureEvent = formatEvent(details.failureEvent);
            }

            const count = await AutomatedScriptService.countLogsBy({
                automationScriptId: details._id,
            });
            const response = {
                details,
                logs,
            };

            return sendListResponse(req, res, response, count);
        } catch (error) {
            return sendErrorResponse(req, res, error);
        }
    }
);

// Route Description: Creates a new script
// req.body -> {name, scriptType, script, successEvent, failureEvent}
// Returns: response new script created
router.post('/:projectId', getUser, isAuthorized, async (req, res) => {
    try {
        const data = req.body;
        data.projectId = req.params.projectId;
        if (!data) {
            return sendErrorResponse(req, res, {
                code: 400,
                message: 'Values should not be null',
            });
        }
        if (!data.name || !data.name.trim()) {
            return sendErrorResponse(req, res, {
                code: 400,
                message: 'Script name is required',
            });
        }

        if (!data.scriptType || data.scriptType.trim().length === 0) {
            return sendErrorResponse(req, res, {
                code: 400,
                message: 'Script Type is required',
            });
        }

        if (!data.script || data.script.trim().length === 0) {
            return sendErrorResponse(req, res, {
                code: 400,
                message: 'Script is required',
            });
        }

        // check if name already exists
        const uniqueName = await AutomatedScriptService.findOneBy({
            projectId: data.projectId,
            name: data.name,
        });

        if (uniqueName) {
            return sendErrorResponse(req, res, {
                code: 400,
                message: 'Script name already exists',
            });
        }

        if (data.successEvent.length > 0) {
            data.successEvent = formatEvent(data.successEvent, true);
        }
        if (data.failureEvent.length > 0) {
            data.failureEvent = formatEvent(data.failureEvent, true);
        }
        const response = await AutomatedScriptService.createScript(data);
        return sendItemResponse(req, res, response);
    } catch (error) {
        return sendErrorResponse(req, res, error);
    }
});

// Route Description: Update a script
// req.body -> {name, scriptType, script, successEvent, failureEvent}
// Returns: response script updated
router.put(
    '/:projectId/:automatedScriptId',
    getUser,
    isAuthorized,
    async (req, res) => {
        try {
            const automatedScriptId = req.params.automatedScriptId;
            const data = req.body;
            data.projectId = req.params.projectId;
            if (!data) {
                return sendErrorResponse(req, res, {
                    code: 400,
                    message: 'Values should not be null',
                });
            }
            if (!data.name || !data.name.trim()) {
                return sendErrorResponse(req, res, {
                    code: 400,
                    message: 'Script name is required',
                });
            }

            if (!data.scriptType || data.scriptType.trim().length === 0) {
                return sendErrorResponse(req, res, {
                    code: 400,
                    message: 'Script Type is required',
                });
            }

            if (!data.script || data.script.trim().length === 0) {
                return sendErrorResponse(req, res, {
                    code: 400,
                    message: 'Script is required',
                });
            }

            // check former name
            const formerName = await AutomatedScriptService.findOneBy({
                projectId: data.projectId,
                _id: automatedScriptId,
            });

            // check if name already exists
            const uniqueName = await AutomatedScriptService.findOneBy({
                projectId: data.projectId,
                name: data.name,
            });

            if (data.name !== formerName.name && uniqueName) {
                return sendErrorResponse(req, res, {
                    code: 400,
                    message: 'Script name already exists',
                });
            }

            if (data.successEvent.length > 0) {
                data.successEvent = formatEvent(data.successEvent, true);
            }
            if (data.failureEvent.length > 0) {
                data.failureEvent = formatEvent(data.failureEvent, true);
            }
            const response = await AutomatedScriptService.updateOne(
                { _id: automatedScriptId },
                data
            );
            return sendItemResponse(req, res, response);
        } catch (error) {
            return sendErrorResponse(req, res, error);
        }
    }
);

router.put(
    '/:projectId/:automatedScriptId/run',
    getUser,
    isAuthorized,
    async (req, res) => {
        try {
            const { automatedScriptId } = req.params;
            const triggeredId = req.user ? req.user.id : null;
            const response = await AutomatedScriptService.runResource({
                triggeredId,
                triggeredBy: 'user',
                resources: { automatedScript: automatedScriptId },
            });
            return sendItemResponse(req, res, response);
        } catch (error) {
            return sendErrorResponse(req, res, error);
        }
    }
);

router.delete(
    '/:projectId/:automatedSlug',
    getUser,
    isAuthorized,
    async function(req, res) {
        try {
            const { automatedSlug } = req.params;
            const userId = req.user ? req.user.id : null;
            const response = await AutomatedScriptService.deleteBy(
                {
                    slug: automatedSlug,
                },
                userId
            );
            return sendItemResponse(req, res, response);
        } catch (error) {
            return sendErrorResponse(req, res, error);
        }
    }
);

const formatEvent = (arr, type) => {
    const result = [];
    for (const item of arr) {
        if (type) {
            result.push({ [item.type]: item.resource });
        } else {
            for (const [key, value] of Object.entries(item)) {
                if (key !== '_id') {
                    result.push({
                        type: String(key),
                        resource: String(value),
                    });
                }
            }
        }
    }
    return result;
};

module.exports = router;