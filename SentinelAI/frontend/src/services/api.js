import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

export const analyzeImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/image/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const analyzeText = async (text) => {
  const response = await api.post("/text/analyze", { text });
  return response.data;
};

export const analyzeAudio = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/audio/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const analyzeVideo = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/video/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const generateReport = async (analysisType, analysisData, filename, notes) => {
  const response = await api.post(
    "/reports/generate",
    {
      analysis_type: analysisType,
      analysis_data: analysisData,
      filename,
      notes,
    },
    { responseType: "blob" }
  );
  return response.data;
};

export const getModuleInfo = async (module) => {
  const response = await api.get(`/${module}/info`);
  return response.data;
};

export default api;
