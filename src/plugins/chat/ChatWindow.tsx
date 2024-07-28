// ChatWindow.tsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '@/redux/store/dynamic_reducer_store';
import { send_message } from './chat_reducer'

const ChatWindow = () => {
    const messages: string[] = useSelector((state: AppState) => state.chat?.messages || []);
    const dispatch = useDispatch();
    const [input, setInput] = useState('');

    const sendMessage = () => {
        if (input.trim() !== '') {
            const msg = {
                type: 'chat/send_message',
                payload: { sender: 'user', content: input },
            };
            console.log("msg", msg);
            dispatch(send_message(input));
            setInput('');
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', width: '300px' }}>
            <div style={{ height: '200px', overflowY: 'scroll', marginBottom: '10px' }}>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}:</strong> {msg.content}
                        <br />
                        <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ width: '100%' }}
            />
            <button onClick={sendMessage} style={{ width: '100%', marginTop: '5px' }}>
                Send
            </button>
        </div>
    );
};

export default ChatWindow;
