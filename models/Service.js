import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: String,
    icon: {
        type: String,
        default: 'bi bi-box-seam'
    },
    color: {
        type: String,
        default: '#2563eb'
    },
    bgColor: {
        type: String,
        default: 'rgba(37,99,235,0.08)'
    },
    path: {
        type: String,
        required: true
    },
    external: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Service', ServiceSchema);
