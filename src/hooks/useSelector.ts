import { useSelector as useSelectorRedux } from 'react-redux'
import { RootState } from '../redux/slices'

const useSelector = () => useSelectorRedux((s: RootState) => s.app)

export default useSelector
