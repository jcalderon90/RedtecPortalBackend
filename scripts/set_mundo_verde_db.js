import mongoose from 'mongoose';
import Organization from '../models/Organization.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde la raíz del backend
dotenv.config({ path: path.join(__dirname, '../.env') });

const MUNDO_VERDE_URI = "mongodb+srv://jorgecalderon:oFeBnppKqA3HfNED@cluster0.vtkafrd.mongodb.net/Garoo?retryWrites=true&w=majority&appName=Cluster0";

const run = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("❌ ERROR: No se encontró MONGO_URI en el archivo .env");
            process.exit(1);
        }

        console.log("🔗 Conectando a la base de datos principal...");
        await mongoose.connect(process.env.MONGO_URI);

        console.log("🔍 Buscando organización 'Mundo Verde'...");
        const org = await Organization.findOne({ 
            $or: [
                { name: /Mundo Verde/i },
                { slug: "mundo-verde" }
            ]
        });

        if (!org) {
            console.error("❌ ERROR: No se encontró la organización 'Mundo Verde' en la base de datos.");
            process.exit(1);
        }

        console.log(`✅ Organización encontrada: ${org.name} (${org._id})`);
        
        org.databaseConfig = {
            mongoUri: MUNDO_VERDE_URI
        };

        await org.save();
        console.log("🚀 BASE DE DATOS CONFIGURADA CON ÉXITO");
        
        process.exit(0);
    } catch (error) {
        console.error("❌ ERROR DURANTE LA ACTUALIZACIÓN:", error.message);
        process.exit(1);
    }
};

run();
