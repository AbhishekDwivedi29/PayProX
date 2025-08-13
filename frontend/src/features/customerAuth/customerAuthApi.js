import axiosInstance from "../../api/customerAxiosInstance";

export async function loginCustomer(email, password) {
  try {
    const res = await axiosInstance.post("/auth/login", { email, password });
    return res.data;
  } catch (err) {
    throw (err.response?.data?.message || "Login failed");
  }
}


export async function registerCustomer( form) {
  try {
    const res = await axiosInstance.post("/auth/register",  form);
    return res.data;
  } catch (err) {
    throw (err.response?.data?.message || "Registration failed");
  }
}









