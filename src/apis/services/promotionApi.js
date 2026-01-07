// src/apis/services/promotionsApi.js
import axios from "axios";

const BASE = process.env.REACT_APP_BASE_URL || "http://localhost:5710/api/admin/";

// Promotions Endpoints
export const PROMOTIONS = {
    LIST: `${BASE}promotions`,
    VIEW: (id) => `${BASE}promotions/${id}`,
    CREATE: `${BASE}promotions`,
    UPDATE: (id) => `${BASE}promotions/${id}`,
    DELETE: (id) => `${BASE}promotions/${id}`,
    SEND: (id) => `${BASE}promotions/${id}/send`,
};

// Fetch Promotions with pagination
export const fetchPromotions = async (pageNo = 1, itemsPerPage = 10) => {
    return axios.get(PROMOTIONS.LIST, {
        params: {
            page: pageNo,
            limit: itemsPerPage,
        },
    });
};

// Fetch single promotion
export const fetchPromotion = async (id) => {
    return axios.get(PROMOTIONS.VIEW(id));
};

// Create promotion
export const createPromotion = async (payload) => {
    return axios.post(PROMOTIONS.CREATE, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

// Update promotion
export const updatePromotion = async (id, payload) => {
    return axios.put(PROMOTIONS.UPDATE(id), payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

// Delete promotion
export const deletePromotion = async (id) => {
    return axios.delete(PROMOTIONS.DELETE(id));
};

// Send promotion
export const sendPromotion = async (id) => {
    return axios.post(PROMOTIONS.SEND(id));
};