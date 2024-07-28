// src/store/wsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IServerAction } from '@/core/base';

interface WsState {
    connected: boolean;
    error: string | null;
}

const initialState: WsState = {
    connected: false,
    error: null,
};

const wsSlice = createSlice({
    name: 'ws',
    initialState,
    reducers: {
        connected(state) {
            state.connected = true;
        },
        disconnected(state) {
            state.connected = false;
        },
        error(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
        sendMessage(state, action: PayloadAction<IServerAction>) {
            console.log('wsSlice sent message', action);
        },
    },
});

export const { connected, disconnected, error, sendMessage } = wsSlice.actions;

export default wsSlice.reducer;
