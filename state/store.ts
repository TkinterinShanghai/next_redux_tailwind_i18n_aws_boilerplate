import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "./counter/counterSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const combinedReducer = combineReducers({
  counter: counterSlice.reducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "user/logout") {
    state = undefined;
  } else if (action.type === "user/login") {
    state = undefined;
  }
  return combinedReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
});


export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
