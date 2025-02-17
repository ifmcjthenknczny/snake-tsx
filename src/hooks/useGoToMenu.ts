import { useDispatch } from 'react-redux'
import { goToMenu } from '../redux/slices'
import { MENU_KEY } from '../constants/controls'
import useKeyClick from './useKeyClick'

const useGoToMenu = (additionalAction?: () => void) => {
    const dispatch = useDispatch()

    const onGoBack = () => dispatch(goToMenu())

    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === MENU_KEY) {
            if (additionalAction) {
                additionalAction()
            }
            onGoBack()
        }
    }

    useKeyClick(handleKeydown)
    return onGoBack
}

export default useGoToMenu
