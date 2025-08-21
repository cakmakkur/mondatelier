import { createSlice } from "@reduxjs/toolkit";
import type { Profile } from "../dto/Profile";
import type { EventDto } from "../dto/EventDto";

// export interface Profile {
//   id: string;
//   profileType: number;
//   profileName: string;
//   firstname: string;
//   lastname: string;
//   bio: string;
//   personalWebsite: string;
//   country: string;
//   bannerPath: string;
//   profilePicturePath: string;
// }

interface EventSlice {
  profiles: {
    [profileId: string]: Profile;
  };
  events: {
    [eventId: string]: EventDto;
  };
}

const initialState: EventSlice = {
  profiles: {},
  events: {},
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    addProfile: (state, action) => {
      const { profileId, profile } = action.payload;
      state.profiles[profileId] = profile;
    },
    addProfiles: (state, action) => {
      const profiles: Profile[] = action.payload;
      profiles.forEach((profile) => {
        state.profiles[profile.id] = profile;
      });
    },
    addEvent: (state, action) => {
      const { eventId, event } = action.payload;
      state.events[eventId] = event;
    },
    addEvents: (state, action) => {
      const events: EventDto[] = action.payload;
      state.events = {};
      events.forEach((event) => {
        state.events[event.id] = event;
      });
    },
  },
});

export const { addProfile, addProfiles, addEvent, addEvents } =
  eventSlice.actions;
export default eventSlice.reducer;
