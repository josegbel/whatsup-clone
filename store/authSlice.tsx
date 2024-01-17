import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userData: null,
    token: null,
    didTryAutoLogin: false,
  },
  reducers: {
    authenticate: (state, action) => {
      const { payload } = action;
      state.userData = payload.userData;
      state.token = payload.token;
    },
    logout: (state) => {
      state.userData = null;
      state.token = null;
    },
    setDidTryAutoLogin: (state) => {
      state.didTryAutoLogin = true;
    },
  },
});

export const authenticate = authSlice.actions.authenticate;
export const setDidTryAutoLogin = authSlice.actions.setDidTryAutoLogin;
export default authSlice.reducer;
