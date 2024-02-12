import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    storedUsers: {},
  },
  reducers: {
    setStoredUsers: (state, action) => {
      const newUsers = action.payload.newUsers;
      const existingUsers = state.storedUsers;

      const usersArray = Object.values(newUsers);
      for (let i = 0; i < usersArray.length; i++) {
        const user = usersArray[i];
        existingUsers[user.userId] = user;
      }

      state.storedUsers = existingUsers;
    },
  },
});

export const setStoredUsers = usersSlice.actions.setStoredUsers;

export default usersSlice.reducer;
