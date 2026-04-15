import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MUNDO_VERDE_URI = "mongodb+srv://jorgecalderon:oFeBnppKqA3HfNED@cluster0.vtkafrd.mongodb.net/Garoo?retryWrites=true&w=majority&appName=Cluster0";

const check = async () => {
    try {
        console.log("🔗 Connecting to Mundo Verde DB...");
        const conn = await mongoose.createConnection(MUNDO_VERDE_URI).asPromise();
        const collections = await conn.db.listCollections().toArray();
        console.log("Collections list:");
        collections.forEach(c => console.log(` - ${c.name}`));
        
        if (collections.some(c => c.name === 'facturas')) {
            console.log("✅ Found 'facturas' (plural)");
        }
        if (collections.some(c => c.name === 'factura')) {
            console.log("✅ Found 'factura' (singular)");
        }
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

check();
