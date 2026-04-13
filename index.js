import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import serviceRoutes from './routes/services.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const mongoUri = process.env.MONGO_URI;
console.log(`[DEBUG] MONGO_URI starts with: ${mongoUri ? mongoUri.substring(0, 30) + '...' : 'UNDEFINED'}`);

if (!mongoUri) {
    console.error('❌ FATAL ERROR: MONGO_URI is not defined in .env file');
}

mongoose.connect(mongoUri)
    .then(() => {
        console.log(`✅ Connected to MongoDB Database: ${mongoose.connection.name}`);
        console.log(`✅ MongoDB Host: ${mongoose.connection.host}`);
    })
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Garoo Services API is running' });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
