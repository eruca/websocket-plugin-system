// App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import dynamic_reducer_store from '@/redux/store/dynamic_reducer_store';
import pluginManager from './core/plugin_manager';
import chat from '@/plugins/chat'

pluginManager.registerPlugin(chat);

const App = () => (
  <Provider store={dynamic_reducer_store.getStore()}>
    {React.createElement(chat.component)}
  </Provider>
);

export default App;
