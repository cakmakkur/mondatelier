// store/communitySlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CommunityDto } from "../dto/CommunityDto";
import type { PostDto } from "../dto/PostDto";

interface CommunityState {
  recent: CommunityDto[];
  my: CommunityDto[];
  feed: PostDto[];
}

const initialState: CommunityState = {
  recent: [],
  my: [],
  feed: [],
};

const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    // RECENT COMMUNITIES
    addRecentCommunity: (state, action: PayloadAction<CommunityDto>) => {
      const exists = state.recent.find((c) => c.id === action.payload.id);
      if (!exists) {
        state.recent.unshift(action.payload);
        if (state.recent.length > 20) {
          state.recent.pop(); // limit size
        }
      }
    },
    clearRecentCommunities: (state) => {
      state.recent = [];
    },

    // MY COMMUNITIES
    setMyCommunities: (state, action: PayloadAction<CommunityDto[]>) => {
      state.my = action.payload;
    },
    addMyCommunity: (state, action: PayloadAction<CommunityDto>) => {
      const exists = state.my.find((c) => c.id === action.payload.id);
      if (!exists) {
        state.my.push(action.payload);
      }
    },
    removeMyCommunity: (state, action: PayloadAction<number>) => {
      state.my = state.my.filter((c) => c.id !== action.payload);
    },

    // FEED
    setFeed: (state, action: PayloadAction<PostDto[]>) => {
      state.feed = action.payload;
    },
    appendToFeed: (state, action: PayloadAction<PostDto[]>) => {
      const newPosts = action.payload.filter(
        (post) => !state.feed.some((f) => f.id === post.id)
      );
      state.feed.push(...newPosts);
    },
    prependPost: (state, action: PayloadAction<PostDto>) => {
      state.feed = [
        action.payload,
        ...state.feed.filter((p) => p.id !== action.payload.id),
      ];
    },
    clearFeed: (state) => {
      state.feed = [];
    },
  },
});

export const {
  addRecentCommunity,
  clearRecentCommunities,
  setMyCommunities,
  addMyCommunity,
  removeMyCommunity,
  setFeed,
  appendToFeed,
  prependPost,
  clearFeed,
} = communitySlice.actions;

export default communitySlice.reducer;
