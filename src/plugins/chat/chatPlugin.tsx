import React from 'react';
import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';

import { IPagePlugin } from '@/core/plugin';

interface ChatState {
    messages: string[];
}

const initialState: ChatState = {
    messages: [],
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<string>) => {
            console.log("addMessage", action)
            state.messages.push(action.payload);
        },
        clearMessages: (state) => {
            state.messages = [];
        },
    },
});

export const { addMessage, clearMessages } = chatSlice.actions;

const chatReducer: Reducer<ChatState> = chatSlice.reducer;

const chatPlugin: IPagePlugin<ChatState, {}> = {
    id: 'chat',
    routePath: '/',
    dependencies: [],
    init: () => {
        console.log('Chat plugin initialized');
    },
    update: (changes: Partial<ChatState>) => {
        // 实现更新状态的逻辑
    },
    destroy: () => {
        // 实现清理资源的逻辑
    },
    getComponent: () => React.lazy(() => import('./Chat')),
    getState: () => initialState, // 返回当前状态
    reducer: chatReducer,
};

export default chatPlugin;
