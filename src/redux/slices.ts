import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GameState, GameOverReason } from '../constants/rules'
import { SETTINGS_DEFAULTS, SettingsWithValue } from '../constants/settings'

type AppState = {
    settings: SettingsWithValue
    lastGameOverReason?: GameOverReason
    score: number
    gameState: GameState
}

const initialState: AppState = {
    settings: SETTINGS_DEFAULTS,
    lastGameOverReason: null,
    score: 0,
    gameState: 'menu'
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setLastGameOverReason: (
            state,
            action: PayloadAction<GameOverReason>
        ) => {
            state.lastGameOverReason = action.payload
        },
        increaseScore: (state, action: PayloadAction<number>) => {
            state.score += action.payload
        },
        setNewGame: (state) => {
            state.gameState = 'playing'
            state.score = 0
        },
        setGameOver: (state, action: PayloadAction<GameOverReason>) => {
            state.gameState = 'gameOver'
            state.lastGameOverReason = action.payload
        },
        setGameState: (state, action: PayloadAction<GameState>) => {
            state.gameState = action.payload
        },
        goToMenu: (state) => {
            state.gameState = 'menu'
        }
    }
})

export type RootState = {
    [appSlice.name]: AppState
}

export const {
    setLastGameOverReason,
    increaseScore,
    setGameState,
    setNewGame,
    setGameOver,
    goToMenu
} = appSlice.actions

export default appSlice.reducer
