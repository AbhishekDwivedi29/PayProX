import axios from "axios";

const PAYMENT_BASE_URL = import.meta.env.VITE_PAYMENT_BASE_URL;

const paymentAxiosInstance = axios.create({
  baseURL: PAYMENT_BASE_URL,
  withCredentials: true,
});

export default paymentAxiosInstance;