// *** NEW ***
import api from "../../src/apis/ApiConfig";       // your axios instance
import { ApiEndPoints } from "../../src/apis/ApiEndPoints"; 

export async function changePasswordApi(payload) {
  try {
    const response = await api.post(ApiEndPoints.CHANGE_PASSWORD, payload);
    return response.data;   // return backend response
  } catch (error) {
    throw error;         
  }
}
