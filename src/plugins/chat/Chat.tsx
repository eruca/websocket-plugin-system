import React from 'react';
import { useDispatch, useSelector } from 'react-redux'

import { addMessage, clearMessages } from './chatPlugin'

const ChatComponent: React.FC = () => {
    const messages: string[] = useSelector((state: any) => state.chat?.messages || []);
    const dispatch = useDispatch();

    const handleAddMessage = () => {
        dispatch(addMessage('Hello, World!'));
    };

    const handleClearMessages = () => {
        dispatch(clearMessages());
    };

    console.log("messages", messages)

    return (
        <div>
            <button onClick={handleAddMessage}>Add Message</button>
            <button onClick={handleClearMessages}>Clear Messages</button>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
};

export default ChatComponent;