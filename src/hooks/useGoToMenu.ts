import { useDispatch } from "react-redux"
import { goToMenu } from "../redux/slices"
import { MENU_KEY } from "../constants/keys"
import useKeyClick from "./useKeyClick"

const useGoToMenu = () => {
    const dispatch = useDispatch()

    const onGoBack = () => dispatch(goToMenu())

    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === MENU_KEY) {
            onGoBack()
        }
    }

    useKeyClick(handleKeydown)
    return onGoBack
}

export default useGoToMenu