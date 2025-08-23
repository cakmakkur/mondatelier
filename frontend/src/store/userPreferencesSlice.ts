import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Preferences } from "../dto/Settings";
import { defaultSettings } from "../dto/Settings";
import axios from "axios";

const USER_PREFERENCES_PATH = import.meta.env.VITE_USER_PREFERENCES_PATH;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchUserPreferences = createAsyncThunk<
  Preferences,
  { userId: string; profileId?: string; profileCountry?: string }
>(
  "userPreferences/fetchUserPreferences",
  async ({ userId, profileId, profileCountry }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/${USER_PREFERENCES_PATH}/${userId}`
      );

      if (response.status === 200) {
        const prefs: Preferences = {
          ...defaultSettings,
          ...response.data,
          profileId: profileId ?? response.data.profileId,
        };

        if (!prefs.eventPreferredCountry && profileCountry) {
          prefs.eventPreferredCountry = profileCountry;
        }

        return prefs;
      }

      return rejectWithValue("Failed to fetch settings");
    } catch (error) {
      console.error("Error fetching settings", error);
      return rejectWithValue(error);
    }
  }
);

interface UserPreferencesState {
  settings: Preferences | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserPreferencesState = {
  settings: null,
  loading: false,
  error: null,
};

const userPreferencesSlice = createSlice({
  name: "userPreferences",
  initialState,
  reducers: {
    setPreference: (
      state,
      action: PayloadAction<{
        key: keyof Preferences;
        value: string | boolean | number;
      }>
    ) => {
      if (!state.settings) return;
      const { key, value } = action.payload;
      if (state.settings[key] !== value) {
        state.settings = { ...state.settings, [key]: value };
      }
    },
    clearPreferences: (state) => {
      state.settings = null;
    },
    loadLocalStorage: (state) => {
      const storedData = localStorage.getItem("settings");
      if (storedData) {
        state.settings = JSON.parse(storedData);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
        localStorage.setItem("settings", JSON.stringify(action.payload));
      })
      .addCase(fetchUserPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setPreference: updateUserPreferences,
  clearPreferences: clearUserPreferences,
  loadLocalStorage,
} = userPreferencesSlice.actions;

export default userPreferencesSlice.reducer;
