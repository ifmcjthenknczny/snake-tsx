import { useSelector as useSelectorRedux } from 'react-redux'
import { RootState } from '../redux/slices'

export const useSelector = () => useSelectorRedux((s: RootState) => s.app)