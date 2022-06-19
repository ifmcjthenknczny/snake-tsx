import { nanoid } from 'nanoid';
import { useEffect, useState } from "react";
import { BOARD_SIZE, ELEMENTS_COLORS } from "../CONSTANTS";
import '../styles/Grid.css';
import { CellColor, Coords } from "../TYPES";
import Cell from "./Cell";

type GridProps = {
    apple: Coords;
    snakeHead: Coords;
    snakeTail: Coords[];
    mines: Coords[]
}

export default function Grid(props: GridProps) {
    const { apple, snakeHead, snakeTail, mines } = props;

    const cellsQuantity = BOARD_SIZE.x * BOARD_SIZE.y;
    const [grid, setGrid] = useState<CellColor[]>(new Array<CellColor>(cellsQuantity).fill('darkgray'))

    useEffect(() => {
        setCellColors()
    }, [props])

    const setCellColors = () => {
        const newGridState = new Array<CellColor>(cellsQuantity).fill(ELEMENTS_COLORS.empty);
        newGridState[BOARD_SIZE.y * apple.y + apple.x] = ELEMENTS_COLORS.apple;
        snakeTail.forEach(e => newGridState[BOARD_SIZE.y * e.y + e.x] = ELEMENTS_COLORS.tail);
        mines.forEach(e => newGridState[BOARD_SIZE.y * e.y + e.x] = ELEMENTS_COLORS.mine);
        if (snakeHead.x > -1 && snakeHead.y > -1 && snakeHead.x < BOARD_SIZE.x && snakeHead.y < BOARD_SIZE.y) newGridState[BOARD_SIZE.y * snakeHead.y + snakeHead.x] = ELEMENTS_COLORS.head;
        setGrid(newGridState)
    }

    return (
        <div className="Grid">
            {grid.map((e, index) => <Cell key={`x:${Math.floor(index/BOARD_SIZE.x)} y:${index%BOARD_SIZE.y}`} color={e} />)}
        </div>
    )
}