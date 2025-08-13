import axiosInstance from "../../api/axiosInstance";

export async function fetchProfile(token) {
  try {
  
    const res = await axiosInstance.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
  
    return res.data.merchant;

  } catch (err) {
    
    throw (err.response?.data?.message || "Failed to load profile");
  }
}

export async function saveBankAccount(token, form, alreadyExists) {
  const method = alreadyExists ? "put" : "post";
  const url = "/merchant/bank";

  const res = await axiosInstance({
    method,
    url,
    data: form,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data;
}

export async function createPublicMerchantUrl(merchantId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const publicUrl = `${import.meta.env.VITE_MERCHANT_URL}/merchant?merchantId=${merchantId}`;
      localStorage.setItem("merchantPublicUrl", publicUrl);
      resolve({ publicUrl });
    }, 1000);
  });
}


export async function MerchantUrl(token) {
  const method = "put"
  const url = "/merchants/website";
  const res = await axiosInstance({
    method,
    url,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
}




