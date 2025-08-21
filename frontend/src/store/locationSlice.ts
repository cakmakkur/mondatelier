import { createSlice } from "@reduxjs/toolkit";

interface LocationSlice {
  countries: string[];
}

const initialState: LocationSlice = {
  countries: [],
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    addCountries: (state, action) => {
      state.countries = action.payload;
    },
  },
});

export const { addCountries } = locationSlice.actions;
export default locationSlice.reducer;
