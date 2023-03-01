import { useEffect, useState } from "react";
import { BOARD_SIZE, ELEMENTS_COLORS } from "../conts";
import '../styles/Grid.css';
import { CellColor, Coords } from "../types";
import Cell from "./Cell";
import { coordsToInt, isWithinGrid } from "../helpers";

type Props = {
    apple: Coords;
    snakeHead: Coords;
    snakeTail: Coords[];
    mines: Coords[]
}

const Grid = ({ apple, snakeHead, snakeTail, mines }: Props) => {
    const cellsQuantity = BOARD_SIZE.x * BOARD_SIZE.y;
    const [grid, setGrid] = useState<CellColor[]>(new Array<CellColor>(cellsQuantity).fill('darkgray'))

    useEffect(() => {
        setCellColors()
    }, [apple, snakeHead, snakeTail, mines]) //eslint-disable-line react-hooks/exhaustive-deps

    const setCellColors = () => {
        const newGridState = new Array<CellColor>(cellsQuantity).fill(ELEMENTS_COLORS.empty);
        newGridState[coordsToInt(apple)] = ELEMENTS_COLORS.apple;
        snakeTail.forEach(tail => newGridState[coordsToInt(tail)] = ELEMENTS_COLORS.tail);
        mines.forEach(mine => newGridState[coordsToInt(mine)] = ELEMENTS_COLORS.mine);
        if (isWithinGrid(snakeHead)) {
            newGridState[coordsToInt(snakeHead)] = ELEMENTS_COLORS.head;
        }
        setGrid(newGridState)
    }

    return (
        <div className="Grid">
            {grid.map((color, index) => <Cell key={index} color={color} />)}
        </div>
    )
}

export default Grid