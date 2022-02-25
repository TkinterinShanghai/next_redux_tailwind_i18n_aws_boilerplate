import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    email: "",
  },
  reducers: {
    clearState: (state) => {
      state.email = "";
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
  },
});

export const { clearState, setEmail } = userSlice.actions;
