import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchTickets = createAsyncThunk('tickets/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/tickets', { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

export const createTicket = createAsyncThunk('tickets/create', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/tickets', formData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

export const updateTicket = createAsyncThunk('tickets/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/tickets/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

export const deleteTicket = createAsyncThunk('tickets/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/tickets/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState: {
    tickets: [],
    total: 0,
    pages: 0,
    loading: false,
    error: null
  },
  reducers: {
    clearTicketError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTickets.pending, (state) => { state.loading = true; })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.tickets;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createTicket.fulfilled, (state, action) => {
        state.tickets.unshift(action.payload);
      })
      // Update
      .addCase(updateTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.tickets[index] = action.payload;
      })
      // Delete
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.tickets = state.tickets.filter(t => t._id !== action.payload);
      });
  }
});

export const { clearTicketError } = ticketsSlice.actions;
export default ticketsSlice.reducer;