import customerAxios from "../../api/customerAxiosInstance";

export async function fetchProfile(token) {
  try {
   
    const res = await customerAxios.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.merchant;
  } catch (err) {
    
    throw (err.response?.data?.message || "Failed to load profile");
  }
}


export async function saveBankAccount(token, form, alreadyExists) {
  const method = alreadyExists ? "put" : "post";
  const url = "/customers/bank";

  const res = await customerAxios({
    method,
    url,
    data: form,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
 
  return res.data;
}
