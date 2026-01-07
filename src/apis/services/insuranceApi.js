// CHANGES MADE: New API Service for Insurance Companies

import axios from "axios";

const BASE = process.env.REACT_APP_BASE_URL;

// All Endpoints
export const INSURANCE_COMPANY = {
    LIST: `${BASE}insurance-company`,
    SELECT: `${BASE}insurance-company/select`,
    VIEW: (id) => `${BASE}insurance-company/${id}`,
    CREATE: `${BASE}insurance-company`,
    UPDATE: (id) => `${BASE}insurance-company/${id}`,
    DELETE: (id) => `${BASE}insurance-company/${id}`,
};
export const INSURANCE_NETWORK = {
    LIST: `${BASE}insurance-network`,
    SELECT: `${BASE}insurance-network/select`,
    VIEW: (id) => `${BASE}insurance-network/${id}`,
    CREATE: `${BASE}insurance-network`,
    UPDATE: (id) => `${BASE}insurance-network/${id}`,
    DELETE: (id) => `${BASE}insurance-network/${id}`,
}; export const INSURANCE_PLAN = {
    LIST: `${BASE}insurance-plans`,
    SELECT: `${BASE}insurance-plans/select`,
    VIEW: (id) => `${BASE}insurance-plans/${id}`,
    CREATE: `${BASE}insurance-plans`,
    UPDATE: (id) => `${BASE}insurance-plans/${id}`,
    DELETE: (id) => `${BASE}insurance-plans/${id}`,
};

// CHANGES MADE: Added server pagination params
export const fetchPlans = async (
    pageNo = 1,
    itemsPerPage = 10,
    searchText = ""
) => {
    return axios.get(INSURANCE_PLAN.LIST, {
        params: {
            page_no: pageNo,
            items_per_page: itemsPerPage,
            ...(searchText ? { search_text: searchText } : {}), // ✅ SAFE
        },
    });
};
export const fetchEstablishmentsSelect = async () => {
    return axios.get(`${BASE}establishments/get_list_for_select`);
};
export const fetchPlan = async (id) => {
    return axios.get(INSURANCE_PLAN.VIEW(id));
};

export const createPlan = async (payload) => {
    return axios.post(INSURANCE_PLAN.CREATE, payload);
};

export const updatePlan = async (id, payload) => {
    return axios.put(INSURANCE_PLAN.UPDATE(id), payload);
};

export const deletePlan = async (id) => {
    return axios.delete(INSURANCE_PLAN.DELETE(id));
};


// GET ALL COMPANIES
// CHANGES MADE: updated param names to match backend
export const fetchCompanies = async (
    pageNo = 1,
    itemsPerPage = 10,
    searchText = ""
) => {
    return axios.get(INSURANCE_COMPANY.LIST, {
        params: {
            page_no: pageNo,
            items_per_page: itemsPerPage,
            ...(searchText ? { search_text: searchText } : {}),
        },
    });
};

export const fetchCompany = async (id) => {
    return axios.get(`${BASE}insurance-company/${id}`);
};


// ⭐ CREATE COMPANY WITH FILE
export const createCompany = async (payload) => {
    return axios.post(INSURANCE_COMPANY.CREATE, payload, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};
// ----------------------------------------------
// NEW: Insurance Categories CRUD
// ----------------------------------------------
export const INSURANCE_CATEGORY = {
    LIST: `${BASE}insurance-specialities`,
    CREATE: `${BASE}insurance-specialities`,
    VIEW: (id) => `${BASE}insurance-specialities/${id}`,
    UPDATE: (id) => `${BASE}insurance-specialities/${id}`,
    DELETE: (id) => `${BASE}insurance-specialities/${id}`,
};
export const fetchInsuranceCategories = async () => axios.get(INSURANCE_CATEGORY.LIST);


// ✅ FIXED: UPDATE COMPANY - Handle both FormData and JSON
// ✅ FIXED: UPDATE COMPANY - Handle both FormData and JSON
export const updateCompany = async (id, payload, isMultipart = false) => {
    if (isMultipart || payload instanceof FormData) {
        // Send FormData as-is (for file uploads)
        return axios.put(INSURANCE_COMPANY.UPDATE(id), payload, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    } else {
        // Send plain object as JSON (no file)
        return axios.put(INSURANCE_COMPANY.UPDATE(id), payload, {
            headers: { "Content-Type": "application/json" }
        });
    }
};
// ⭐ NEW: Benefit Suggestion Search
export const searchBenefits = async (query) =>
    axios.get(`${process.env.REACT_APP_BASE_URL}insurance-plans/benefits/search`, {
        params: { search_text: query }
    });
export const fetchBenefit = async (id) => {
    return axios.get(`${BASE}benefits/${id}`);
};

// DELETE COMPANY
export const deleteCompany = async (id) => {
    return axios.delete(INSURANCE_COMPANY.DELETE(id));
};


// ⭐ FETCH NETWORK LIST
// CHANGES MADE: Added server pagination params
export const fetchNetworks = async (
    pageNo = 1,
    itemsPerPage = 10,
    searchText = ""
) => {
    return axios.get(INSURANCE_NETWORK.LIST, {
        params: {
            page_no: pageNo,
            items_per_page: itemsPerPage,
            ...(searchText ? { search_text: searchText } : {}),
        },
    });
};

// ⭐ CREATE NETWORK
export const createNetwork = async (payload) => {
    return axios.post(INSURANCE_NETWORK.CREATE, payload);
};

// ⭐ UPDATE NETWORK
export const updateNetwork = async (id, payload) => {
    return axios.put(INSURANCE_NETWORK.UPDATE(id), payload);
};

// ⭐ DELETE NETWORK
export const deleteNetwork = async (id) => {
    return axios.delete(INSURANCE_NETWORK.DELETE(id));
};
export const fetchNetwork = async (id) => {
    return axios.get(`${BASE}insurance-network/${id}`);
};

// ⭐ BULK UPLOAD PLANS
export const bulkUploadPlans = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return axios.post(`${BASE}insurance-plans/bulk-upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
    });
};
