import dayjs from 'dayjs';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
    messages: { sender: string, content: string, timestamp: number }[];
}

const initState: ChatState = {
    messages: [],
};

const chatReducer = createSlice({
    name: 'chat',
    initialState: initState,
    reducers: {
        send_message: (state: ChatState, action: PayloadAction<string>) => {
            state.messages.push({ sender: "我", content: action.payload, timestamp: dayjs().unix() });
        }
    }
})

export const { send_message } = chatReducer.actions;

export default chatReducer;