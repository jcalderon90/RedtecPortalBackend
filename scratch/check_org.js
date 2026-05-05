import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const OrganizationSchema = new mongoose.Schema({
    name: String,
    slug: String,
    activeServices: [String]
});

const UserSchema = new mongoose.Schema({
    email: String,
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    allowedServices: [String],
    role: String
});

async function check() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        const Organization = mongoose.model('Organization', OrganizationSchema);
        const User = mongoose.model('User', UserSchema);

        const org = await Organization.findOne({ slug: 'mundo-verde' });
        console.log('\n--- Organization: Mundo Verde ---');
        if (org) {
            console.log('ID:', org._id);
            console.log('Active Services:', org.activeServices);
        } else {
            console.log('Organization "mundo-verde" NOT FOUND.');
        }

        const user = await User.findOne({ email: 'mundo@garoo.ai' }).populate('organization');
        console.log('\n--- User: mundo@garoo.ai ---');
        if (user) {
            console.log('ID:', user._id);
            console.log('Role:', user.role);
            console.log('Organization:', user.organization?.name || 'No Org');
            console.log('Allowed Services:', user.allowedServices);
        } else {
            console.log('User "mundo@garoo.ai" NOT FOUND.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

check();
