// App.tsx
import { Provider } from 'react-redux';
import { store } from '@/redux/store/store';
import ChatWindow from '@/plugins/chat/ChatWindow';

const App = () => (
  <Provider store={store}>
    <ChatWindow />
  </Provider>
);

export default App;
