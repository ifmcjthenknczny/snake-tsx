import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import styles from './MobileTouchControls.module.scss'
import MobileTouchZone from '../MobileTouchZone/MobileTouchZone'
import {
    CONTROL_KEYS,
    Key,
    MOBILE_TOUCH_CONFIG
} from '../../../constants/controls'

type Props = PropsWithChildren<{ handleMove: (key: string) => void }>

const MOBILE_TOUCH_ZONE_SHOW_TIME_MS = 500

export type ContainerDimensions = {
    width: number
    height: number
    top: number
    left: number
}

function determineTouchZone(
    relativeX: number,
    relativeY: number,
    { height, width }: ContainerDimensions
) {
    for (const key in MOBILE_TOUCH_CONFIG) {
        const { heightTopMin, heightTopMax, widthLeftMin, widthLeftMax } =
            MOBILE_TOUCH_CONFIG[key as Key]
        if (
            relativeY > heightTopMin * height &&
            relativeY <= heightTopMax * height &&
            relativeX > widthLeftMin * width &&
            relativeX <= widthLeftMax * width
        ) {
            return key as Key
        }
    }
}

const MobileTouchControls = ({ handleMove, children }: Props) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [touchZoneShown, setTouchZoneShown] = useState<Key>()
    const [containerDimensions, setContainerDimensions] =
        useState<ContainerDimensions>()

    useEffect(() => {
        setTimeout(() => {
            setTouchZoneShown(undefined)
        }, MOBILE_TOUCH_ZONE_SHOW_TIME_MS)
    }, [touchZoneShown])

    useEffect(() => {
        if (!containerRef.current) {
            return
        }
        const { width, height, top, left } =
            containerRef.current.getBoundingClientRect()
        setContainerDimensions({
            width,
            height,
            top,
            left
        })
    }, [containerRef.current])

    const handleTouch = (e: React.TouchEvent) => {
        if (!containerRef.current) {
            return
        }
        const touch = e.touches[0]
        const { top, left, width, height } =
            containerRef.current.getBoundingClientRect()
        setContainerDimensions({ width, height, top, left })
        const relativeX = touch.clientX - left
        const relativeY = touch.clientY - top

        const touchZone = determineTouchZone(relativeX, relativeY, {
            height,
            width,
            top,
            left
        })

        if (touchZone) {
            handleMove(touchZone)
            setTouchZoneShown(touchZone)
        }
    }

    return (
        <div
            ref={containerRef}
            className={styles.touchControls}
            onTouchStart={handleTouch}
        >
            {CONTROL_KEYS.map((key) => (
                <MobileTouchZone
                    key={key}
                    zone={key}
                    isShown={touchZoneShown === key}
                    containerDimensions={containerDimensions}
                />
            ))}
            {children}
        </div>
    )
}

export default MobileTouchControls
