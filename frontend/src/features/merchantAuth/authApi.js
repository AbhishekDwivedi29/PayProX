import axiosInstance from "../../api/axiosInstance";

export async function loginMerchant(email, password) {
  try {
    const res = await axiosInstance.post("/auth/login", { email, password });
 
    return res.data;
  } catch (err) {

    throw (err.response?.data?.message || "Login failed");
  }
}


export async function registerMerchant(formData) {
  try {
    const res = await axiosInstance.post("/auth/register", formData);
    return res.data;
  } catch (err) {
    throw (err.response?.data?.message || "Registration failed");
  }
}
