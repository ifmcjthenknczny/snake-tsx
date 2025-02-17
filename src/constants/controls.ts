export type Key = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown'

type MobileTouchConfig = {
    heightTopMin: number
    heightTopMax: number
    widthLeftMin: number
    widthLeftMax: number
}

export const CONTROL_KEYS: Key[] = [
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown'
]
export const MENU_KEY = 'Escape'
export const PAUSE_KEY = 'Enter' // not implemented
export const FAST_SNAKE_KEY = 'Space' // not implemented

export const MOBILE_TOUCH_CONFIG: Record<Key, MobileTouchConfig> = {
    ArrowLeft: {
        heightTopMin: 0.25,
        heightTopMax: 0.75,
        widthLeftMin: 0,
        widthLeftMax: 0.5
    },
    ArrowRight: {
        heightTopMin: 0.25,
        heightTopMax: 0.75,
        widthLeftMin: 0.5,
        widthLeftMax: 1
    },
    ArrowUp: {
        heightTopMin: 0,
        heightTopMax: 0.25,
        widthLeftMin: 0,
        widthLeftMax: 1
    },
    ArrowDown: {
        heightTopMin: 0.75,
        heightTopMax: 1,
        widthLeftMin: 0,
        widthLeftMax: 1
    }
}
