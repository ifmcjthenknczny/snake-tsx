import React from 'react'
import { CellColor } from '../../../constants/board'

export type Props = {
    color: CellColor
}

const Cell = ({ color }: Props) => (
    <div className="Cell" style={{ backgroundColor: color }}></div>
)

export default Cell
