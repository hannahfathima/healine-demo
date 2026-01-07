import axios from "axios";
import instance from "../ApiConfig";
import { ApiEndPoints } from "../ApiEndPoints";

export const login = async (data: object) => {
  try {
    const result = await instance({
      url: ApiEndPoints.LOGIN_API_CALL,
      method: "POST",
      data,
    });
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (data) => {
  try {
    // ⭐ SUPER ADMIN CHECK (SAFE & CORRECT POSITION)
    const user = JSON.parse(localStorage.getItem("userDetails"));
    if (!user || user.role_id !== 1) {
      return {
        status: 403,
        message: "Only Super Admin can create new admins",
      };
    }

    const result = await instance({
      url: ApiEndPoints.SIGNUP_API_CALL,
      method: "POST",
      data,
    });

    return result.data;

  } catch (error) {
    return {
      status: 500,
      message: error?.response?.data?.message || "Signup failed",
    };
  }
};


// ⭐ NEW — Fetch roles
export const getRoles = async () => {
  try {
    const result = await instance({
      url: ApiEndPoints.GET_ROLES,
      method: "GET",
    });
    return result.data?.data || [];
  } catch (error) {
    return [];
  }
};

