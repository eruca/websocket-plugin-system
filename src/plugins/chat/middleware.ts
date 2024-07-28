import { Dispatch, MiddlewareAPI } from '@reduxjs/toolkit';

const middleware = (store: MiddlewareAPI) => (next: Dispatch) => (action: any) => {
    console.log('middleware in chat plugin', action);
    if (action.type === 'chat/send_message') {
        console.log('chatPlugin middleware triggered');
        // Here you could add more complex logic, e.g., sending the message to a WebSocket server
    }
    return next(action);
};

export default middleware;
