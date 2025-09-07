import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "./eventSlice";
import locationReducer from "./locationSlice";
import recentCommunitiesReducer from "./recentCommunitiesSlice";

export const store = configureStore({
  reducer: {
    event: eventReducer,
    location: locationReducer,
    recentCommunities: recentCommunitiesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
