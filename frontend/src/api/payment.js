import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const createPayment = async (data) => {
  const response = await API.post("/payments/create", data);
  return response.data;
};

export const verifyPayment = async (data) => {
  const response = await API.post("/payments/verify", data);
  return response.data;
};