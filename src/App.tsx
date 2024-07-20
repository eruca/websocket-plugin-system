// App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux'

import DynamicReducersStore from './redux/store/store.ts'
import PluginManager from '@/core/plugin_manager';
import chatPlugin from './plugins/chat/chatPlugin.tsx';

const dynStore = new DynamicReducersStore();
const pluginManager = new PluginManager(dynStore);

// 假设插件是在应用的其他地方注册的
// 示例插件懒加载设置
pluginManager.register_page(chatPlugin);

const App = () => {
  return (
    <Provider store={dynStore.getStore()}>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {pluginManager.getAllPages().map(plugin => (
              <Route
                key={plugin.id}
                path={plugin.routePath}
                element={React.createElement(plugin.getComponent())}
              />
            ))}
          </Routes>
        </Suspense>
      </Router>
    </Provider >
  );
};

export default App;