import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "./eventSlice";
import locationReducer from "./locationSlice";
import userPreferencesReducer from "./userPreferencesSlice";

export const store = configureStore({
  reducer: {
    event: eventReducer,
    location: locationReducer,
    userPreferences: userPreferencesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
