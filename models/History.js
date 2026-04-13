import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema({
    serviceId: {
        type: String,
        required: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    inputData: mongoose.Schema.Types.Mixed,
    outputData: mongoose.Schema.Types.Mixed,
    status: {
        type: String,
        enum: ['success', 'error', 'pending'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('History', HistorySchema);
