import { CellColor } from '../types'

export type Props = {
    color: CellColor
}

const Cell = ({ color }: Props) => (
    <div className="Cell" style={{ backgroundColor: color }}></div>
)

export default Cell