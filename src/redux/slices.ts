import { GameState, SettingName, SettingValue } from "./../types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SETTINGS_DEFAULTS } from "../constants/settings";
import { GameOverReason, SettingsWithValue } from "../types/types";
import { calculateRealSettingValue } from "../helpers/settings";

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
      action: PayloadAction<{
        settingName: SettingName;
        settingValue: SettingValue;
      }>
    ) => {
      const { settingName, settingValue } = action.payload;
      state.settings = {
        ...state.settings,
        ...{
          [settingName]: {
            relative: settingValue,
            real: calculateRealSettingValue(settingName, settingValue),
          },
        },
      };
    },
    toggleBooleanSetting: (
      state,
      settingName: PayloadAction<keyof AppState["settings"]>
    ) => {
      state.settings[settingName.payload] = {
        relative: !state.settings[settingName.payload].relative,
        real: !state.settings[settingName.payload].real
      };
    },
    setLastGameOverReason: (state, action: PayloadAction<GameOverReason>) => {
      state.lastGameOverReason = action.payload;
    },
    increaseScore: (state, action: PayloadAction<number>) => {
      state.score += action.payload;
    },
    setNewGame: (state) => {
      state.gameState = "playing";
      state.score = 0;
    },
    setGameOver: (state, action: PayloadAction<GameOverReason>) => {
      state.gameState = "gameOver";
      state.lastGameOverReason = action.payload;
    },
    setGameState: (state, action: PayloadAction<GameState>) => {
      state.gameState = action.payload;
    },
    goToMenu: (state) => {
      state.gameState = 'menu'
    }
  },
});

export type RootState = {
  [appSlice.name]: AppState;
};

export const {
  toggleBooleanSetting,
  updateSetting,
  setLastGameOverReason,
  increaseScore,
  setGameState,
  setNewGame,
  setGameOver,
  goToMenu,
} = appSlice.actions;

export default appSlice.reducer;
