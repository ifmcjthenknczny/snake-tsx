import { useRef } from "react"

type Props = {
    from: number
    to: number
    step: number
    startingValue: number
    setValue: React.Dispatch<React.SetStateAction<number>>
}

const NumberInput = ({ from, to, step, startingValue, setValue }: Props) => {
    const value = useRef<number>(startingValue)

    const handleAdd = () => {
        if (value.current + step > to) {
            return
        }
        value.current = value.current + step
    }
    const handleSubtract = () => {
        if (value.current - step < from) {
            return
        }
        value.current = value.current - step
    }


    return (<div className="Input">
        {value.current - step > from && <button onClick={handleSubtract}>-</button>}
        {value.current}
        {value.current + step < to && <button onClick={handleAdd}>+</button>}
    </div>
    )
}

export default NumberInput