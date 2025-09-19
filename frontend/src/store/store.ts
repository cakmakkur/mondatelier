import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "./eventSlice";
import locationReducer from "./locationSlice";
import communityReducer from "./communitySlice";

export const store = configureStore({
  reducer: {
    event: eventReducer,
    location: locationReducer,
    community: communityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
