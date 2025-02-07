import { Key } from './keys'

export type GameState = 'menu' | 'settings' | 'gameOver' | 'playing' | 'help'

export type GameOverReason = (typeof GAME_OVER_REASONS)[number]

export const STARTING_DIRECTION: Key = 'ArrowLeft'

export const NEW_MINE_DISTANCE_FROM_HEAD: number = 3

export const OPPOSITE_DIRECTIONS: Record<Key, Key> = {
    ArrowLeft: 'ArrowRight',
    ArrowRight: 'ArrowLeft',
    ArrowUp: 'ArrowDown',
    ArrowDown: 'ArrowUp'
}

export const GAME_OVER_REASONS = ['wall', 'tail', 'mine'] as const
