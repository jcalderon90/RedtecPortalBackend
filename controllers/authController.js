import User from '../models/User.js';
import Organization from '../models/Organization.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d'
    });
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user and populate organization
        const user = await User.findOne({ email }).populate('organization');
        
        if (!user) {
            console.log(`Login failed: User not found (${email})`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log(`Login failed: Password mismatch for ${email}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!user.active) {
            return res.status(403).json({ error: 'Account is disabled' });
        }

        res.json({
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                organization: user.organization
            },
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const me = async (req, res) => {
    res.json(req.user);
};
