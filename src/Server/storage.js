// Save auth status
export const isaurth = (val) => {
  localStorage.setItem("aurth", val);
};

// Get auth status
export const getAurth = () => {
  return localStorage.getItem("aurth") === "true";
};

// Save user info (object)
export const Add_Use_id = (user) => {
  localStorage.setItem("useId", JSON.stringify(user));
};

// Get user info
export const get_use_id = () => {
  return JSON.parse(localStorage.getItem("useId"));
};

// Clear auth and user info
export const clearAuth = () => {
  localStorage.removeItem("aurth");
  localStorage.removeItem("useId");
};
