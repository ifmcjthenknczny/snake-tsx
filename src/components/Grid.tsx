import { BOARD_SIZE } from "../CONSTANTS";
import '../styles/Grid.css';
import { GridProps } from "../TYPES";
import Cell from "./Cell";
// import { BOARD_SIZE } from '../CONSTANTS'

export default function Grid({ }: GridProps) {
    const cellsQuantity = BOARD_SIZE.x * BOARD_SIZE.y;

    return (
        <div className="Grid">
            {Array.apply(null, Array(5)).map(e => <Cell color="red" />)}
        </div>
    )
}