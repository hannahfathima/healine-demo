// ===============================
// PillPack Pharmacy APIs
// ===============================

import axios from "axios";

const BASE = process.env.REACT_APP_BASE_URL;

/* ============================
   PRESCRIPTIONS
============================ */
export const PILLPACK_PRESCRIPTIONS = {
  LIST: `${BASE}pillpack/prescriptions`,
  VIEW: (id) => `${BASE}pillpack/prescriptions/${id}`,
  VERIFY: (id) => `${BASE}pillpack/prescriptions/${id}/verify`,
};

export const fetchPrescriptions = async () => {
  return axios.get(PILLPACK_PRESCRIPTIONS.LIST);
};

export const fetchPrescriptionById = async (id) => {
  return axios.get(PILLPACK_PRESCRIPTIONS.VIEW(id));
};

export const verifyPrescription = async (id, payload) => {
  return axios.put(PILLPACK_PRESCRIPTIONS.VERIFY(id), payload, {
    headers: { "Content-Type": "application/json" },
  });
};

/* ============================
   SUBSCRIPTIONS
============================ */
export const fetchPillpackSubscriptions = async () => {
  return axios.get(`${BASE}pillpack/subscriptions`);
};

/* ============================
   DOSE PACKS
============================ */
export const fetchDosePacks = async () => {
  return axios.get(`${BASE}pillpack/dose-packs`);
};

export const updateDosePackStatus = async (id, payload) => {
  return axios.put(`${BASE}pillpack/dose-packs/${id}/status`, payload);
};
