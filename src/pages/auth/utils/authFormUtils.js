export const normalizePhone = (value = "") => value.replace(/\D/g, "").slice(0, 11);

export const formatPhone = (value = "") => {
  const digits = normalizePhone(value);

  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

export const isValidEmail = (email = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhone = (phone = "") => /^01\d{8,9}$/.test(normalizePhone(phone));

export const getApiErrorMessage = (error, fallback) => {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message;
  }

  if (typeof data?.error === "string" && data.error.trim()) {
    return data.error;
  }

  return fallback;
};
