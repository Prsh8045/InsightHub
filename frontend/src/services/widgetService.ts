import api from "../api/axios";

export const updateWidget = async (widgetId: number, data: any) => {
  const response = await api.put(`/widgets/${widgetId}`, data);
  return response.data;
};

export const createWidget = async (data: any) => {
  const response = await api.post("/widgets", data);
  return response.data;
};

export const deleteWidget = async (widgetId: number) => {
  const response = await api.delete(`/widgets/${widgetId}`);
  return response.data;
};
