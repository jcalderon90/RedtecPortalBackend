import axios from 'axios';
import mongoose from 'mongoose';
import History from '../models/History.js';
import Service from '../models/Service.js';

export const proxyService = async (req, res) => {
    const { serviceId } = req.params;
    const user = req.user || null;
    const organization = user?.organization || null;

    if (user && organization && !organization.activeServices.includes(serviceId)) {
        return res.status(403).json({ error: `Service '${serviceId}' not active for your organization.` });
    }

    try {
        const REDTEC_BASE = process.env.N8N_BASE_URL || "https://agentsprod.redtec.ai/webhook";
        const targetUrl = `${REDTEC_BASE}/${serviceId}`;

        console.log(`🚀 Proxying ${req.method} for ${serviceId} (Public: ${!user})`);

        const response = await axios({
            method: req.method,
            url: targetUrl,
            data: req.body,
            params: req.query,
            headers: { 
                'Content-Type': req.headers['content-type'] || 'application/json',
            }
        });

        History.create({
            serviceId,
            organization: organization?._id || null,
            user: user?._id || null,
            inputData: req.body,
            outputData: response.data,
            status: 'success'
        }).catch(() => {});

        res.json(response.data);
    } catch (error) {
        console.error(`❌ Proxy error for ${serviceId}:`, error.message);
        
        History.create({
            serviceId,
            organization: organization?._id || null,
            user: user?._id || null,
            inputData: req.body,
            outputData: { error: error.message },
            status: 'error'
        }).catch(() => {});

        res.status(error.response?.status || 500).json({ 
            error: `Failed to process ${serviceId}`,
            details: error.message 
        });
    }
};

export const getUserServices = async (req, res) => {
    try {
        const { organization, role, allowedServices } = req.user;
        
        // 1. Obtener TODOS los servicios activos de la DB
        const allServicesInDB = await Service.find({ active: true });
        
        // 2. Determinar la lista de slugs autorizados y normalizar
        const roleNormalized = (role || '').toLowerCase();
        const orgActiveServices = (organization?.activeServices || []).map(s => s.toLowerCase().trim());
        const userAllowedServices = (allowedServices || []).map(s => s.toLowerCase().trim());

        // 3. Filtrar en MEMORIA (Seguro y robusto)
        const effectiveList = (roleNormalized === 'admin') 
            ? orgActiveServices 
            : orgActiveServices.filter(slug => userAllowedServices.includes(slug));

        // 4. Cruzar con la metadata completa
        const serviceDocs = allServicesInDB.filter(s => 
            effectiveList.includes((s.slug || '').toLowerCase().trim())
        );

        // 5. Mapear al formato final
        const services = serviceDocs.map(doc => ({
            ...doc.toObject(),
            client_name: organization?.name || 'Garoo Client'
        }));

        res.json({ services_list: services });
    } catch (error) {
        console.error('Error in getUserServices:', error);
        res.status(500).json({ error: error.message });
    }
};
