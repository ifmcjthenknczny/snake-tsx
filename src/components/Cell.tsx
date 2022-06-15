import { CellProps } from '../TYPES'

export default function Cell(props: CellProps) {
    const {color} = props;
    return (
        <div className="Cell" style={{ backgroundColor: color }}></div>
    )
}