import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authQuery } from "./authQuery";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    email: "",
    loggedIn: false,
  },
  reducers: {
    logOut: (state) => {
      state.loggedIn = false;
      state.email = "";
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authQuery.endpoints.logIn.matchFulfilled, (state, { payload }) => {
      state.loggedIn = true;
    });
  },
});

export const { logOut, setEmail } = authSlice.actions;
