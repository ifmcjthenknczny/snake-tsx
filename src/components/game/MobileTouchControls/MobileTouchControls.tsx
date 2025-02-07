import React, { PropsWithChildren, useRef } from 'react'
import styles from './MobileTouchControls.module.scss'

type Props = PropsWithChildren<{ handleMove: (key: string) => void }>

const MobileTouchControls = ({ handleMove, children }: Props) => {
    const containerRef = useRef<HTMLDivElement | null>(null)

    const handleTouch = (e: React.TouchEvent) => {
        if (!containerRef.current) {
            return
        }
        const touch = e.touches[0]
        const { top, left, width, height } =
            containerRef.current.getBoundingClientRect()
        const relativeX = touch.clientX - left
        const relativeY = touch.clientY - top

        if (relativeY < height * 0.25) {
            handleMove('ArrowUp')
        } else if (relativeY > height * 0.75) {
            handleMove('ArrowDown')
        } else if (relativeX < width * 0.5) {
            handleMove('ArrowLeft')
        } else {
            handleMove('ArrowRight')
        }
    }

    return (
        <div
            ref={containerRef}
            className={styles.touchControls}
            onTouchStart={handleTouch}
        >
            {children}
        </div>
    )
}

export default MobileTouchControls
