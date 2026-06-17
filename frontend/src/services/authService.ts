import api from "../api/axios";

export const loginUser =
    async (data: any) => {

        const response =
            await api.post(
                "/auth/login",
                data
            );

        return response.data;

    };

export const getProfile =
    async () => {

        const response =
            await api.get(
                "/auth/profile"
            );

        return response.data;

    };

export const logout =
    async () => {

        const response =
            await api.post(
                "/auth/logout"
            );

        return response.data;

    };