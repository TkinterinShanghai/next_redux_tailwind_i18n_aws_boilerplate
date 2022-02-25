import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./auth/authQuery";
import { userSlice } from "./user/userSlice";

const combinedReducer = combineReducers({
  user: userSlice.reducer,
  [api.reducerPath]: api.reducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "auth/logout") {
    state = undefined;
  } else if (action.type === "auth/login") {
    state = undefined;
  }
  return combinedReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
