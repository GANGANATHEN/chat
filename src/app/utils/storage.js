export const uid = () =>
  Date.now().toString() + Math.random().toString(36).slice(2);

export const loadLocal = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  return JSON.parse(localStorage.getItem(key)) || fallback;
};

export const saveLocal = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const loadSession = (key) => {
  if (typeof window === "undefined") return null;
  return JSON.parse(sessionStorage.getItem(key));
};
