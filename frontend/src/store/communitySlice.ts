// store/communitySlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CommunityDto } from "../dto/CommunityDto";
import type { PostDto } from "../dto/PostDto";

interface CommunityState {
  recent: CommunityDto[];
  my: CommunityDto[];
  feed: PostDto[];
  scrollY: number;
  rememberScroll: boolean;
  likes: number[];
}

const initialState: CommunityState = {
  recent: [],
  my: [],
  feed: [],
  scrollY: 0,
  rememberScroll: false,
  likes: [],
};

const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    // SCROLL
    setScrollY: (state, action: PayloadAction<number>) => {
      state.scrollY = action.payload;
    },
    setRememberScroll: (state, action: PayloadAction<boolean>) => {
      state.rememberScroll = action.payload;
    },

    // LIKES
    setLikes: (state, action: PayloadAction<number[]>) => {
      state.likes = action.payload;
    },
    addLike: (state, action: PayloadAction<number>) => {
      state.likes.push(action.payload);
    },
    removeLike: (state, action: PayloadAction<number>) => {
      state.likes = state.likes.filter((l) => l !== action.payload);
    },

    // RECENT COMMUNITIES
    addRecentCommunity: (state, action: PayloadAction<CommunityDto>) => {
      state.recent = state.recent.filter((c) => c.id !== action.payload.id);
      state.recent.unshift(action.payload);
      if (state.recent.length > 20) {
        state.recent.pop();
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
  setScrollY,
  setRememberScroll,
  setLikes,
  addLike,
  removeLike,
} = communitySlice.actions;

export default communitySlice.reducer;
