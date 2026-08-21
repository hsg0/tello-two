import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4020";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/web/drone`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createUser = async () => {
  const { data } = await api.post("/user");
  return data;
};

export const startupDrone = async ({ userId, droneId }) => {
  const { data } = await api.post("/startup", { userId, droneId });
  return data;
};

export default api;
