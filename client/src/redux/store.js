import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import ticketsReducer from './ticketsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketsReducer,
  },
});