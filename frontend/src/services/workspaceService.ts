import api from "../api/axios";

export const getWorkspaces = async () => {
  const response = await api.get("/workspaces");
  return response.data;
};

export const getWorkspace = async (workspaceId: number) => {
  const response = await api.get(`/workspaces/${workspaceId}`);
  return response.data;
};
