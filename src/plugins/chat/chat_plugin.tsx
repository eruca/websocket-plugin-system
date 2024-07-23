import { Dispatch } from '@reduxjs/toolkit';
import { Plugin, PluginContext } from '@/core/plugin';

interface ChatState {
    messages: { sender: string, content: string, timestamp: number }[];
}

const initialState: ChatState = {
    messages: [],
};

const chatPlugin: Plugin = {
    name: 'chat_plugin',
    reducer: (state = initialState, action) => {
        console.log("chat plugin reducer", state, action);

        switch (action.type) {
            case 'chat/send_message':
                console.log('send message', action);

                return {
                    ...state,
                    messages: [
                        ...state.messages,
                        { sender: action.payload.sender, content: action.payload.content, timestamp: Date.now() },
                    ],
                };
            default:
                return state;
        }
    },
    middleware: (context: PluginContext) => (next: Dispatch) => (action: any) => {
        console.log('middleware in chat plugin', action);
        if (action.type === 'chat/send_message') {
            console.log('chatPlugin middleware triggered');
            // Here you could add more complex logic, e.g., sending the message to a WebSocket server
        }
        return next(action);
    },
};

export default chatPlugin;
