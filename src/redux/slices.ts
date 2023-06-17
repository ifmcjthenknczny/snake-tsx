import { GameState } from "./../types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SETTINGS_DEFAULTS } from "../constants/settings";
import { GameOverReason, SettingsWithValue } from "../types/types";

type AppState = {
  settings: SettingsWithValue;
  lastGameOverReason?: GameOverReason;
  score: number;
  gameState: GameState;
};

const initialState: AppState = {
  settings: SETTINGS_DEFAULTS,
  lastGameOverReason: null,
  score: 0,
  gameState: "menu",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateSetting: (
      state,
      action: PayloadAction<Partial<AppState["settings"]>>
    ) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    toggleSetting: (
      state,
      settingName: PayloadAction<keyof AppState["settings"]>
    ) => {
      state.settings[settingName.payload] =
        !state.settings[settingName.payload];
    },
    setLastGameOverReason: (state, action: PayloadAction<GameOverReason>) => {
      state.lastGameOverReason = action.payload;
    },
    increaseScore: (state, action: PayloadAction<number>) => {
      state.score += action.payload;
    },
    setGameState: (state, action: PayloadAction<GameState>) => {
      state.gameState = action.payload;
    },
  },
});

export type RootState = {
  [appSlice.name]: AppState;
};

export const {
  toggleSetting,
  updateSetting,
  setLastGameOverReason,
  increaseScore,
  setGameState,
} = appSlice.actions;

export default appSlice.reducer;
