import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authQuery } from "./auth/authQuery";
import { authSlice } from "./auth/authSlice";

const combinedReducer = combineReducers({
  auth: authSlice.reducer,
  [authQuery.reducerPath]: authQuery.reducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "auth/logOut") {
    console.log("Logout triggered");
    state = undefined;
  } else if (action.type === "auth/logIn") {
    state = undefined;
  }
  return combinedReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authQuery.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
