import mongoose, {
    RequiredFields,
    UniqueFields,
    EncryptedFields,
} from '../Infrastructure/ORM';

const Schema = mongoose.Schema;
const schema = new Schema(
    {
        projectId: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            alias: 'project',
            index: true,
        },
        incidentState: {
            type: Schema.Types.String,
        },
        incidentNote: {
            type: Schema.Types.String,
        },
        name: String,
        deleted: { type: Boolean, default: false },
        deletedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

export const requiredFields: RequiredFields = schema.requiredPaths();

export const uniqueFields: UniqueFields = [];
export const encryptedFields: EncryptedFields = [];

export const slugifyField: string = '';

export default mongoose.model('IncidentNoteTemplate', schema);