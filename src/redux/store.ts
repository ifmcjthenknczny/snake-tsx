import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices';

const store = configureStore({
  reducer: {
    app: appReducer,
  },
});

export default store;
