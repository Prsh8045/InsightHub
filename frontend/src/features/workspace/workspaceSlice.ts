import {
    createSlice
}
    from "@reduxjs/toolkit";

const workspaceSlice =
    createSlice({

        name: "workspace",

        initialState: {
            selectedWorkspace: null
        },

        reducers: {

            setWorkspace:
                (state, action) => {

                    state.selectedWorkspace =
                        action.payload;

                }

        }

    });

export const {
    setWorkspace
}
    =
    workspaceSlice.actions;

export default
    workspaceSlice.reducer;