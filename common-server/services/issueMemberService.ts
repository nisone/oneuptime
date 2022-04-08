export default class Service {
    async create(data: $TSFixMe) {
        const _this = this;

        // prepare issue member model
        let issueMember = new IssueMemberModel();

        issueMember.userId = data.userId;

        issueMember.issueId = data.issueId;

        issueMember.createdById = data.createdById;

        const savedIssueMember = await issueMember.save();

        const selectIssueMember =
            'issueId userId createdAt createdById removed removedAt removedById';

        const populateIssueMember = [
            { path: 'issueId', select: 'name' },

            { path: 'userId', select: 'name email' },
        ];
        issueMember = await _this.findOneBy({
            query: { _id: savedIssueMember._id },
            select: selectIssueMember,
            populate: populateIssueMember,
        });
        return issueMember;
    }
    // find a list of Members assigned to an Issue
    async findBy({ query, select, populate, sort }: FindBy) {
        if (!query) {
            query = {};
        }

        const issuesQuery = IssueMemberModel.find(query).sort(sort).lean();

        issuesQuery.select(select);
        issuesQuery.populate(populate);

        const issues = await issuesQuery;
        return issues;
    }
    async findOneBy({ query, select, populate, sort }: FindOneBy) {
        if (!query) {
            query = {};
        }

        const issueMemberQuery = IssueMemberModel.findOne(query)
            .sort(sort)
            .lean();

        issueMemberQuery.select(select);
        issueMemberQuery.populate(populate);

        const issueMember = await issueMemberQuery;

        return issueMember;
    }

    async updateOneBy(query: Query, data: $TSFixMe, unsetData = null) {
        if (!query) {
            query = {};
        }

        let issueMember = await IssueMemberModel.findOneAndUpdate(
            query,
            { $set: data },
            {
                new: true,
            }
        );

        if (unsetData) {
            issueMember = await IssueMemberModel.findOneAndUpdate(
                query,
                { $unset: unsetData },
                {
                    new: true,
                }
            );
        }

        const selectIssueMember =
            'issueId userId createdAt createdById removed removedAt removedById';

        const populateIssueMember = [
            { path: 'issueId', select: 'name' },

            { path: 'userId', select: 'name email' },
        ];

        issueMember = await this.findOneBy({
            query,
            select: selectIssueMember,
            populate: populateIssueMember,
        });

        return issueMember;
    }
}

import IssueMemberModel from '../models/issueMember';

import FindOneBy from '../types/db/FindOneBy';
import FindBy from '../types/db/FindBy';
import Query from '../types/db/Query';