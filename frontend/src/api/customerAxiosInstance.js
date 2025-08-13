import axios from "axios";

const CUSTOMER_BASE_URL = import.meta.env.VITE_CUSTOMER_BASE_URL;

const customerAxiosInstance = axios.create({
  baseURL: CUSTOMER_BASE_URL,
  withCredentials: true,
});

export default customerAxiosInstance;