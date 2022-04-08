import moment from 'moment';
import { ObjectId } from 'mongodb';
import Database from 'common-server/utils/database';
const probeCollection = Database.getDatabase().collection('probes');
import { v1 as uuidv1 } from 'uuid';
import { post } from '../utils/api';
import { realtimeUrl } from '../Config';
const realtimeBaseUrl = `${realtimeUrl}/realtime`;

export default {
    create: async function (data) {
        const _this = this;
        let probeKey;
        if (data.probeKey) {
            probeKey = data.probeKey;
        } else {
            probeKey = uuidv1();
        }
        const storedProbe = await _this.findOneBy({
            probeName: data.probeName,
        });
        if (storedProbe && storedProbe.probeName) {
            const error = new Error('Probe name already exists.');

            error.code = 400;

            throw error;
        } else {
            const probe = {};

            probe.probeKey = probeKey;

            probe.probeName = data.probeName;

            probe.version = data.probeVersion;

            const now = new Date(moment().format());

            probe.createdAt = now;

            probe.lastAlive = now;

            probe.deleted = false;

            const result = await probeCollection.insertOne(probe);
            const savedProbe = await _this.findOneBy({
                _id: ObjectId(result.insertedId),
            });
            return savedProbe;
        }
    },

    findOneBy: async function (query) {
        if (!query) {
            query = {};
        }

        if (!query.deleted)
            query.$or = [{ deleted: false }, { deleted: { $exists: false } }];

        const probe = await probeCollection.findOne(query);
        return probe;
    },

    updateOneBy: async function (query, data) {
        if (!query) {
            query = {};
        }

        if (!query.deleted)
            query.$or = [{ deleted: false }, { deleted: { $exists: false } }];

        await probeCollection.updateOne(query, { $set: data });
        const probe = await this.findOneBy(query);
        return probe;
    },

    updateProbeStatus: async function (probeId) {
        const now = new Date(moment().format());
        await probeCollection.updateOne(
            {
                _id: ObjectId(probeId),
                $or: [{ deleted: false }, { deleted: { $exists: false } }],
            },
            { $set: { lastAlive: now } }
        );
        const probe = await this.findOneBy({
            _id: ObjectId(probeId),
        });

        // realtime update for probe
        post(`${realtimeBaseUrl}/update-probe`, { data: probe }, true);
        return probe;
    },
};