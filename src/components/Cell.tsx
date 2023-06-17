import { CellColor } from '../types/types'
import React from 'react'

export type Props = {
    color: CellColor
}

const Cell = ({ color }: Props) => (
    <div className="Cell" style={{ backgroundColor: color }}></div>
)

export default Cell