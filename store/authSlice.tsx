import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userData: null,
    token: null,
  },
  reducers: {
    authenticate: (state, action) => {
      const { payload } = action;
      state.userData = payload.userData;
      state.token = payload.token;
      console.log(state);
    },
    logout: (state) => {
      state.userData = null;
      state.token = null;
    },
  },
});

export const authenticate = authSlice.actions.authenticate;
export default authSlice.reducer;
