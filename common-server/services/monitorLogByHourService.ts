export default class Service {
    async create(data: $TSFixMe) {
        const LogHour = new MonitorLogByHourModel();

        LogHour.monitorId = data.monitorId;

        LogHour.probeId = data.probeId;

        LogHour.status = data.status;

        LogHour.responseTime = data.responseTime;

        LogHour.responseStatus = data.responseStatus;

        LogHour.cpuLoad = data.cpuLoad;

        LogHour.avgCpuLoad = data.avgCpuLoad;

        LogHour.cpuCores = data.cpuCores;

        LogHour.memoryUsed = data.memoryUsed;

        LogHour.totalMemory = data.totalMemory;

        LogHour.swapUsed = data.swapUsed;

        LogHour.storageUsed = data.storageUsed;

        LogHour.totalStorage = data.totalStorage;

        LogHour.storageUsage = data.storageUsage;

        LogHour.mainTemp = data.mainTemp;

        LogHour.maxTemp = data.maxTemp;

        LogHour.maxResponseTime = data.responseTime;

        LogHour.maxCpuLoad = data.cpuLoad;

        LogHour.maxMemoryUsed = data.memoryUsed;

        LogHour.maxStorageUsed = data.storageUsed;

        LogHour.maxMainTemp = data.mainTemp;

        LogHour.intervalDate = data.intervalDate;

        LogHour.sslCertificate = data.sslCertificate;

        LogHour.kubernetesLog = data.kubernetesData || {};

        const savedLogHour = await LogHour.save();

        return savedLogHour;
    }

    async updateOneBy(query: Query, data: $TSFixMe) {
        if (!query) {
            query = {};
        }

        const monitorLogByHour = await MonitorLogByHourModel.findOneAndUpdate(
            query,
            { $set: data },
            {
                new: true,
            }
        );

        return monitorLogByHour;
    }

    async findBy({ query, limit, skip, select, populate, sort }: FindBy) {
        if (!skip) skip = 0;

        if (!limit) limit = 0;

        if (typeof skip === 'string') {
            skip = parseInt(skip);
        }

        if (typeof limit === 'string') {
            limit = parseInt(limit);
        }

        if (!query) {
            query = {};
        }

        const monitorLogsByHourQuery = MonitorLogByHourModel.find(query)
            .lean()
            .sort(sort)
            .limit(limit.toNumber())
            .skip(skip.toNumber());

        monitorLogsByHourQuery.select(select);
        monitorLogsByHourQuery.populate(populate);

        const monitorLogsByHour = await monitorLogsByHourQuery;

        return monitorLogsByHour;
    }

    async findOneBy({ query, select, populate, sort }: FindOneBy) {
        if (!query) {
            query = {};
        }

        const monitorLogQuery = MonitorLogByHourModel.findOne(query)
            .sort(sort)
            .lean();

        monitorLogQuery.select(select);
        monitorLogQuery.populate(populate);

        const monitorLog = await monitorLogQuery;
        return monitorLog;
    }

    async countBy(query: Query) {
        if (!query) {
            query = {};
        }

        const count = await MonitorLogByHourModel.countDocuments(query);

        return count;
    }
}

import MonitorLogByHourModel from '../models/monitorLogByHour';

import FindOneBy from '../types/db/FindOneBy';
import FindBy from '../types/db/FindBy';
import Query from '../types/db/Query';