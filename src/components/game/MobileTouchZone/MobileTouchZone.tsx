import React, { useMemo } from 'react'
import { Key, MOBILE_TOUCH_CONFIG } from '../../../constants/controls'
import classNames from 'classnames'
import styles from './MobileTouchZone.module.scss'
import { ContainerDimensions } from '../MobileTouchControls/MobileTouchControls'

type Props = {
    zone: Key
    isShown: boolean
    containerDimensions?: ContainerDimensions
}

export default function MobileTouchZone({
    zone,
    isShown,
    containerDimensions
}: Props) {
    if (!containerDimensions) {
        return null
    }
    const config = useMemo(() => MOBILE_TOUCH_CONFIG[zone], [])

    const top =
        containerDimensions.height * config.heightTopMin +
        containerDimensions.top
    const height =
        containerDimensions.height * (config.heightTopMax - config.heightTopMin)
    const left =
        containerDimensions.width * config.widthLeftMin +
        containerDimensions.left
    const width =
        containerDimensions.width * (config.widthLeftMax - config.widthLeftMin)

    return (
        <div
            className={classNames(
                styles.mobileTouchZone,
                !isShown && styles.hidden
            )}
            style={{
                top: `${top}px`,
                left: `${left}px`,
                width: `${width}px`,
                height: `${height}px`
            }}
        />
    )
}
