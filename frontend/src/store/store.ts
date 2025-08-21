import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "./eventSlice";
import locationReducer from "./locationSlice";

export const store = configureStore({
  reducer: {
    event: eventReducer,
    location: locationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
