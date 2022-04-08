import MonitorSlaModel from '../models/monitorSla';
import MonitorService from './MonitorService';

import FindOneBy from '../types/db/FindOneBy';
import FindBy from '../types/db/FindBy';
import Query from '../types/db/Query';

export default class Service {
    async create(data: $TSFixMe) {
        const monitorSlaCount = await this.countBy({
            name: data.name,
            projectId: data.projectId,
        });
        if (monitorSlaCount && monitorSlaCount > 0) {
            const error = new Error(
                'Monitor SLA with the same name already exist'
            );

            error.code = 400;
            throw error;
        }

        if (data.isDefault) {
            // automatically set isDefault to false
            // for any previous SLA with a default status
            await MonitorSlaModel.findOneAndUpdate(
                {
                    projectId: data.projectId,
                    isDefault: true,
                },
                { $set: { isDefault: false } }
            );
        }

        const createdMonitorSla = await MonitorSlaModel.create(data);

        if (data.monitors && data.monitors.length > 0) {
            let monitorIds = [...data.monitors];
            monitorIds = [...new Set(monitorIds)];

            await MonitorService.updateManyMonitorSla(
                monitorIds,
                createdMonitorSla._id
            );
        }

        return createdMonitorSla;
    }

    async findOneBy({ query, select, populate, sort }: FindOneBy) {
        if (!query) query = {};

        if (!query['deleted']) query['deleted'] = false;

        const monitorSlaQuery = MonitorSlaModel.findOne(query)
            .sort(sort)
            .lean();

        monitorSlaQuery.select(select);
        monitorSlaQuery.populate(populate);

        const monitorSla = await monitorSlaQuery;
        return monitorSla;
    }

    async findBy({ query, limit, skip, populate, select, sort }: FindBy) {
        if (!skip) skip = 0;

        if (!limit) limit = 0;

        if (typeof skip === 'string') skip = Number(skip);

        if (typeof limit === 'string') limit = Number(limit);

        if (!query) query = {};

        if (!query['deleted']) query['deleted'] = false;

        const monitorSlaQuery = MonitorSlaModel.find(query)
            .lean()
            .sort(sort)
            .limit(limit.toNumber())
            .skip(skip.toNumber());

        monitorSlaQuery.select(select);
        monitorSlaQuery.populate(populate);

        const monitorSla = await monitorSlaQuery;

        return monitorSla;
    }

    async updateOneBy(query: Query, data: $TSFixMe) {
        if (!query) query = {};

        if (!query['deleted']) query['deleted'] = false;

        // check if we are only setting default sla
        // or using update modal for editing the details
        if (!data.handleDefault) {
            const monitorSla = await this.findOneBy({
                query: { name: data.name, projectId: query.projectId },
                select: '_id',
            });

            if (monitorSla && String(monitorSla._id) !== String(query._id)) {
                const error = new Error(
                    'Monitor SLA with the same name already exist'
                );

                error.code = 400;
                throw error;
            }

            const monitors = await MonitorService.findBy({
                query: { monitorSla: query._id },
                select: '_id',
            });
            const initialMonitorIds = monitors.map(
                (monitor: $TSFixMe) => monitor._id
            );

            const removedMonitors: $TSFixMe = [];
            if (data.monitors && data.monitors.length > 0) {
                let monitorIds = [...data.monitors];
                monitorIds = [...new Set(monitorIds)];
                monitorIds = monitorIds.map(id => String(id));
                initialMonitorIds.forEach((monitorId: $TSFixMe) => {
                    if (!monitorIds.includes(String(monitorId))) {
                        removedMonitors.push(monitorId);
                    }
                });
                await MonitorService.updateManyMonitorSla(
                    monitorIds,
                    query._id
                );
            } else {
                // unset monitorSla for removed monitors
                // at this point all the monitors were removed

                await MonitorService.unsetColumnsOfManyMonitors(
                    initialMonitorIds,
                    { monitorSla: true }
                );
            }

            // unset monitorSla for removed monitors
            if (removedMonitors && removedMonitors.length > 0) {
                await MonitorService.unsetColumnsOfManyMonitors(
                    removedMonitors,
                    { monitorSla: true }
                );
            }
        }

        let monitorSla;
        if (data.isDefault) {
            monitorSla = await this.findOneBy({
                query: { projectId: query.projectId, isDefault: true },
                select: '_id',
            });
        }

        if (monitorSla && String(monitorSla._id) !== String(query._id)) {
            await MonitorSlaModel.findOneAndUpdate(
                { _id: monitorSla._id },
                { $set: { isDefault: false } }
            );
        }

        let updatedMonitorSla = await MonitorSlaModel.findOneAndUpdate(
            query,
            {
                $set: data,
            },
            { new: true }
        );

        if (!updatedMonitorSla) {
            const error = new Error('Monitor SLA not found or does not exist');

            error.code = 400;
            throw error;
        }

        const selectMonSla =
            'name projectId isDefault frequency monitorUptime deleted deletedAt';

        const populateMonSla = [{ path: 'projectId', select: 'name slug' }];
        updatedMonitorSla = await this.findOneBy({
            query,
            select: selectMonSla,
            populate: populateMonSla,
        });

        return updatedMonitorSla;
    }

    async deleteBy(query: Query) {
        const deletedSla = await MonitorSlaModel.findOneAndUpdate(
            query,
            {
                $set: {
                    deleted: true,
                    deletedAt: Date.now(),
                },
            },
            { new: true }
        );

        return deletedSla;
    }

    async hardDelete(query: Query) {
        await MonitorSlaModel.deleteMany(query);
        return 'Monitor SLA(s) deleted successfully';
    }
    async countBy(query: Query) {
        if (!query) {
            query = {};
        }

        if (!query['deleted']) query['deleted'] = false;
        const count = await MonitorSlaModel.countDocuments(query);
        return count;
    }
}