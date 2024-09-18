import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(window?.localStorage.getItem("userInfo")) ?? {
    accountType: "seeker",
    token : null
  },
};

const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
    },
    logout(state) {
      state.user = null;
      console.log(state.user,"logout");
      localStorage?.removeItem("userInfo");
    },
  },
});

export default userSlice.reducer;

export function Login(user) {
  return (dispatch, getState) => {
    console.log("Logging in user:", user);
    dispatch(userSlice.actions.login({user}));
  };
}

export function Logout() {
  return (dispatch, getState) => {
    console.log("Logging out user");
    dispatch(userSlice.actions.logout());
  };
}
