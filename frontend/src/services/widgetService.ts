import api from "../api/axios";

export const updateWidget = async (widgetId: number, data: any) => {
  const response = await api.put(`/widgets/${widgetId}`, data);
  return response.data;
};
