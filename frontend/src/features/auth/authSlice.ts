import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    status: "idle",
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.status = "succeeded";
        },

        logoutUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.status = "failed";
        },

        setLoading: (state) => {
            state.status = "loading";
        },
    },
});

export const {
    setUser,
    logoutUser,
    setLoading,
} = authSlice.actions;

export default authSlice.reducer;