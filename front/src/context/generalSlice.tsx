import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  notification: "",
};

export const generalSlice = createSlice({
  name: "general",
  initialState: initialState,
  reducers: {
    /* ----------ERROR------------------------ */
    showOrCloseNotification: (state, action: PayloadAction<string>) => {
      state.notification = action.payload;
    },
  },
});

export const { showOrCloseNotification } = generalSlice.actions;

export default generalSlice.reducer;
