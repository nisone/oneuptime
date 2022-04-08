import incidentSMSActionModel from '../models/incidentSMSAction';
import Query from '../types/db/Query';

export default class Service {
    async findBy(query: Query) {
        const alerts = await incidentSMSActionModel.find(query).lean();
        return alerts;
    }

    async updateOneBy(query: Query, data: $TSFixMe) {
        if (!query) {
            query = {};
        }

        if (!query['deleted']) query['deleted'] = false;
        const incidentafter = await incidentSMSActionModel.findOneAndUpdate(
            query,
            {
                $set: data,
            },
            {
                new: true,
            }
        );
        return incidentafter;
    }
}