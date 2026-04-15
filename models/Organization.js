import mongoose from 'mongoose';

const OrganizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    activeServices: [{
        type: String // e.g., 'applications', 'invoices', 'video-analysis'
    }],
    databaseConfig: {
        mongoUri: {
            type: String,
            trim: true
        }
    },
    settings: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Organization', OrganizationSchema);
