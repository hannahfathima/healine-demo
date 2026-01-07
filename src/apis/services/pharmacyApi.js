// src/apis/services/pharmacyApi.js
import axios from "axios";

const BASE = process.env.REACT_APP_BASE_URL;

// Pharmacy Categories Endpoints
export const PHARMACY_CATEGORY = {
    LIST: `${BASE}pharmacy-categories`,
    SELECT: `${BASE}pharmacy-categories/get_pharmacy_categories_for_select`,
    VIEW: (id) => `${BASE}pharmacy-categories/${id}`,
    CREATE: `${BASE}pharmacy-categories`,
    UPDATE: (id) => `${BASE}pharmacy-categories/${id}`,
    DELETE: (id) => `${BASE}pharmacy-categories/${id}`,
};

// Pharmacy Products Endpoints
export const PHARMACY_PRODUCT = {
    LIST: `${BASE}pharmacy-products`,
    SELECT: `${BASE}pharmacy-products/get_pharmacy_products_for_select`,
    VIEW: (id) => `${BASE}pharmacy-products/${id}`,
    CREATE: `${BASE}pharmacy-products`,
    UPDATE: (id) => `${BASE}pharmacy-products/${id}`,
    DELETE: (id) => `${BASE}pharmacy-products/${id}`,
};

// Pharmacy Inventory Endpoints (assuming this covers "Pharmacy Brand" as per labeling)
export const PHARMACY_INVENTORY = {
    LIST: `${BASE}pharmacy-inventory`,
    SELECT: `${BASE}pharmacy-inventory/get_pharmacy_inventory_for_select`,
    VIEW: (id) => `${BASE}pharmacy-inventory/${id}`,
    CREATE: `${BASE}pharmacy-inventory`,
    UPDATE: (id) => `${BASE}pharmacy-inventory/${id}`,
    DELETE: (id) => `${BASE}pharmacy-inventory/${id}`,
};

// Assumed Pharmacy Brands for Product selects (endpoints not provided; adjust if needed)
export const PHARMACY_BRAND = {
    LIST: `${BASE}pharmacy-brands`,
    SELECT: `${BASE}pharmacy-brands/get_pharmacy_brands_for_select`,
    VIEW: (id) => `${BASE}pharmacy-brands/${id}`,
    CREATE: `${BASE}pharmacy-brands`,
    UPDATE: (id) => `${BASE}pharmacy-brands/${id}`,
    DELETE: (id) => `${BASE}pharmacy-brands/${id}`,
};

// Fetch Categories with pagination and search
export const fetchCategories = async (
    pageNo = 1,
    itemsPerPage = 10,
    searchText = ""
) => {
    return axios.get(PHARMACY_CATEGORY.LIST, {
        params: {
            page_no: pageNo,
            items_per_page: itemsPerPage,
            ...(searchText ? { search_text: searchText } : {}),
        },
    });
};

export const fetchCategoriesSelect = async () => {
    return axios.get(PHARMACY_CATEGORY.SELECT);
};

export const fetchCategory = async (id) => {
    return axios.get(PHARMACY_CATEGORY.VIEW(id));
};

export const createCategory = async (payload) => {
    return axios.post(PHARMACY_CATEGORY.CREATE, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const updateCategory = async (id, payload, isMultipart = false) => {
    if (isMultipart || payload instanceof FormData) {
        return axios.put(PHARMACY_CATEGORY.UPDATE(id), payload, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    } else {
        return axios.put(PHARMACY_CATEGORY.UPDATE(id), payload, {
            headers: { "Content-Type": "application/json" },
        });
    }
};

export const deleteCategory = async (id) => {
    return axios.delete(PHARMACY_CATEGORY.DELETE(id));
};

// Fetch Products with pagination and search
export const fetchProducts = async (
    pageNo = 1,
    itemsPerPage = 10,
    searchText = ""
) => {
    return axios.get(PHARMACY_PRODUCT.LIST, {
        params: {
            page_no: pageNo,
            items_per_page: itemsPerPage,
            ...(searchText ? { search_text: searchText } : {}),
        },
    });
};

export const fetchProductsSelect = async () => {
    return axios.get(PHARMACY_PRODUCT.SELECT);
};

export const fetchProduct = async (id) => {
    return axios.get(PHARMACY_PRODUCT.VIEW(id));
};

export const createProduct = async (payload) => {
    return axios.post(PHARMACY_PRODUCT.CREATE, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const updateProduct = async (id, payload, isMultipart = false) => {
    if (isMultipart || payload instanceof FormData) {
        return axios.put(PHARMACY_PRODUCT.UPDATE(id), payload, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    } else {
        return axios.put(PHARMACY_PRODUCT.UPDATE(id), payload, {
            headers: { "Content-Type": "application/json" },
        });
    }
};

export const deleteProduct = async (id) => {
    return axios.delete(PHARMACY_PRODUCT.DELETE(id));
};

// Fetch Inventory with pagination and search
export const fetchInventory = async (
    pageNo = 1,
    itemsPerPage = 10,
    searchText = ""
) => {
    return axios.get(PHARMACY_INVENTORY.LIST, {
        params: {
            page_no: pageNo,
            items_per_page: itemsPerPage,
            ...(searchText ? { search_text: searchText } : {}),
        },
    });
};

export const fetchInventorySelect = async () => {
    return axios.get(PHARMACY_INVENTORY.SELECT);
};

export const fetchInventoryItem = async (id) => {
    return axios.get(PHARMACY_INVENTORY.VIEW(id));
};

export const createInventory = async (payload) => {
    return axios.post(PHARMACY_INVENTORY.CREATE, payload);
};

export const updateInventory = async (id, payload) => {
    return axios.put(PHARMACY_INVENTORY.UPDATE(id), payload);
};

export const deleteInventory = async (id) => {
    return axios.delete(PHARMACY_INVENTORY.DELETE(id));
};



// Fetch Establishments for Inventory selects (reusing from existing)
export const fetchEstablishmentsSelect = async () => {
    return axios.get(`${BASE}establishments/get_list_for_select`);
};


// Fetch Brands with pagination and search
export const fetchBrands = async (
    pageNo = 1,
    itemsPerPage = 10,
    searchText = ""
) => {
    return axios.get(PHARMACY_BRAND.LIST, {
        params: {
            page_no: pageNo,
            items_per_page: itemsPerPage,
            ...(searchText ? { search_text: searchText } : {}),
        },
    });
};

export const fetchBrandsSelect = async () => {
    return axios.get(PHARMACY_BRAND.SELECT);
};

export const fetchBrand = async (id) => {
    return axios.get(PHARMACY_BRAND.VIEW(id));
};

export const createBrand = async (payload) => {
    return axios.post(PHARMACY_BRAND.CREATE, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const updateBrand = async (id, payload, isMultipart = false) => {
    if (isMultipart || payload instanceof FormData) {
        return axios.put(PHARMACY_BRAND.UPDATE(id), payload, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    } else {
        return axios.put(PHARMACY_BRAND.UPDATE(id), payload, {
            headers: { "Content-Type": "application/json" },
        });
    }
};

export const deleteBrand = async (id) => {
    return axios.delete(PHARMACY_BRAND.DELETE(id));
};