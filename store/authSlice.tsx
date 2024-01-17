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
      state.didTryAutoLogin = true;
    },
    logout: (state) => {
      state.userData = null;
      state.token = null;
      state.didTryAutoLogin = false;
    },
    setDidTryAutoLogin: (state) => {
      state.didTryAutoLogin = true;
    },
  },
});

export const authenticate = authSlice.actions.authenticate;
export const setDidTryAutoLogin = authSlice.actions.setDidTryAutoLogin;
export const logout = authSlice.actions.logout;
export default authSlice.reducer;
