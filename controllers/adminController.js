import Organization from '../models/Organization.js';
import User from '../models/User.js';
import Service from '../models/Service.js';

// Organizations
export const getOrganizations = async (req, res) => {
    try {
        const orgs = await Organization.find().sort({ name: 1 });
        res.json(orgs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createOrganization = async (req, res) => {
    try {
        const { activeServices, ...rest } = req.body;
        const normalized = {
            ...rest,
            activeServices: (activeServices || []).map(s => s.toLowerCase().trim()).filter(Boolean)
        };
        const org = await Organization.create(normalized);
        res.status(201).json(org);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateOrganization = async (req, res) => {
    try {
        const { activeServices, ...rest } = req.body;
        const normalized = {
            ...rest,
            activeServices: (activeServices || []).map(s => s.toLowerCase().trim()).filter(Boolean)
        };
        const org = await Organization.findByIdAndUpdate(req.params.id, normalized, { new: true });
        res.json(org);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('organization').sort({ firstName: 1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { allowedServices, ...rest } = req.body;
        const normalized = {
            ...rest,
            allowedServices: (allowedServices || []).map(s => s.toLowerCase().trim()).filter(Boolean)
        };
        const user = await User.create(normalized);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { password, allowedServices, ...updateData } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Update fields
        Object.assign(user, updateData);
        
        if (allowedServices) {
            user.allowedServices = allowedServices.map(s => s.toLowerCase().trim()).filter(Boolean);
        }
        
        // Only update password if provided
        if (password) {
            user.password = password;
        }

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Services
export const getServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ name: 1 });
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createService = async (req, res) => {
    try {
        const service = await Service.create(req.body);
        res.status(201).json(service);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(service);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteService = async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: 'Service deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
