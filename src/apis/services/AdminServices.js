// Updated AdminServices.js
import axios from "axios";
import { ApiEndPoints } from "../ApiEndPoints";
import instance from "../ApiConfig";

const baseURL = process.env.REACT_APP_BASE_URL;

// Get all admin users
export const getAdminUsersApi = async (pageNo = 1, itemsPerPage = 10) => {
    try {
        const url = `${baseURL}${ApiEndPoints.GET_ADMIN_USERS}?page_no=${pageNo}&items_per_page=${itemsPerPage}`;

        // 🔁 UPDATED: use instance (token auto-added)
        const response = await instance.get(url);

        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get all roles
export const getRolesApi = async () => {
    try {
        const url = `${baseURL}${ApiEndPoints.GET_ROLES}`;
        const response = await instance.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Create new role
export const createRoleApi = async (payload) => {
    try {
        const url = `${baseURL}${ApiEndPoints.CREATE_ROLE}`;
        const response = await instance.post(url, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update role
export const updateRoleApi = async (id, payload) => {
    try {
        const url = `${baseURL}${ApiEndPoints.UPDATE_ROLE}${id}`;
        const response = await instance.put(url, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete role
export const deleteRoleApi = async (id) => {
    try {
        const url = `${baseURL}${ApiEndPoints.DELETE_ROLE}${id}`;
        const response = await instance.delete(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};
// Assign role to admin
export const assignRoleApi = async (payload) => {
    try {
        const url = `${baseURL}${ApiEndPoints.ASSIGN_ROLE}`; // ⭐ FIXED
        const response = await instance.post(url, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};



// Assign permissions to admin
// 🔁 UPDATED: Assign permissions to admin WITH FULL LOGGING
export const assignPermissionsApi = async (payload) => {
    console.log("🔁 [assignPermissionsApi] Request payload:", payload);

    try {
        const url = `${baseURL}${ApiEndPoints.ASSIGN_PERMISSIONS}`;
        console.log("🔁 [assignPermissionsApi] POST URL:", url);

        // 🔁 UPDATED: use instance (token auto-added)
        const response = await instance.post(url, payload);

        console.log("✅ [assignPermissionsApi] Response:", response.data);
        return response.data;
    } catch (error) {
        console.log("❌ [assignPermissionsApi] ERROR:", error.response?.data);
        throw error;
    }
};
export const resetAdminPasswordApi = async (payload) => {
    try {
        const url = `${baseURL}auth/reset-admin-password`;
        const response = await instance.post(url, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const deleteAdminApi = async (adminId) => {
    try {
        const response = await instance.delete(
            ApiEndPoints.DELETE_ADMIN + adminId
        );
        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: "Delete failed" };
    }
};
