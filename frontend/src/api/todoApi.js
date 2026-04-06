import axios from "axios";

// All calls go to CLIENT-SERVICE (port 8080)
// The Vite proxy forwards /client → http://localhost:8080/client
const BASE_URL = "/client/todos";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export const todoApi = {
  getAll: () => api.get(),
  getById: (id) => api.get(`/${id}`),
  create: (task) => api.post("", { task, completed: false }),
  update: (id, data) => api.put(`/${id}`, data),
  delete: (id) => api.delete(`/${id}`),

  getHealth: () => api.get("/health"),

};
