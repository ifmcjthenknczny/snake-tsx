import { nanoid } from 'nanoid';
import { useEffect, useState } from "react";
import { BOARD_SIZE, ELEMENTS_COLORS } from "../CONSTANTS";
import '../styles/Grid.css';
import { CellColor, GridProps } from "../TYPES";
import Cell from "./Cell";

export default function Grid(props: GridProps) {
    const { applePosition, snakeHead, snakeTail } = props;

    const cellsQuantity = BOARD_SIZE.x * BOARD_SIZE.y;
    const [grid, setGrid] = useState<CellColor[]>(new Array<CellColor>(cellsQuantity).fill('darkgray'))

    useEffect(() => {
        setCellColors()
    }, [props])

    const setCellColors = () => {
        const newGridState = new Array<CellColor>(cellsQuantity).fill(ELEMENTS_COLORS.empty);
        newGridState[BOARD_SIZE.y * applePosition.y + applePosition.x] = ELEMENTS_COLORS.apple;
        newGridState[BOARD_SIZE.y * snakeHead.y + snakeHead.x] = ELEMENTS_COLORS.head;
        snakeTail.forEach(e => newGridState[BOARD_SIZE.y * e.y + e.x] = ELEMENTS_COLORS.tail);

        setGrid(newGridState)
    }

    return (
        <div className="Grid">
            {grid.map(e => <Cell key={nanoid()} color={e} />)}
        </div>
    )
}