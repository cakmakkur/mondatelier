import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CommunityDto } from "../dto/CommunityDto"; // adjust path

const STORAGE_KEY = "recentCommunities";

const loadFromStorage = (): CommunityDto[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? (JSON.parse(data) as CommunityDto[]) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (data: CommunityDto[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

interface RecentCommunitiesState {
  items: CommunityDto[];
}

const initialState: RecentCommunitiesState = {
  items: loadFromStorage(),
};

const recentCommunitiesSlice = createSlice({
  name: "recentCommunities",
  initialState,
  reducers: {
    addCommunity: (state, action: PayloadAction<CommunityDto>) => {
      const community = action.payload;

      state.items = state.items.filter((c) => c.id !== community.id);

      state.items.unshift(community);

      if (state.items.length > 10) {
        state.items = state.items.slice(0, 10);
      }

      saveToStorage(state.items);
    },
    clearCommunities: (state) => {
      state.items = [];
      saveToStorage(state.items);
    },
  },
});

export const { addCommunity, clearCommunities } =
  recentCommunitiesSlice.actions;
export default recentCommunitiesSlice.reducer;
