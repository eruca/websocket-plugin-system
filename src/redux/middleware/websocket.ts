// import ReconnectingWebSocket from 'reconnecting-websocket';
import { MiddlewareAPI, Dispatch, compose, UnknownAction } from '@reduxjs/toolkit';

// import { websocketAddr } from '@/settings/system';
import { PluginManager } from '@/core/plugin_manager';
import { PluginContext } from '@/core/plugin';

const websocket = (pm: PluginManager) => (store: MiddlewareAPI) => {
    // const pm = new PluginManager();

    // const ws = new ReconnectingWebSocket('https://echo.websocket.org/', undefined, {
    //     debug: true,
    //     // 可以添加更多重连配置项
    // });

    // ws.onmessage = (e: MessageEvent) => {
    //     try {
    //         if (typeof e.data === 'string') {
    //             console.log('data from websocket', e.data);
    //             const action = JSON.parse(e.data);
    //             console.log('received from websocket:', action);
    //             handleReceivedAction(store, pm, action);
    //         }
    //     } catch (error) {
    //         console.error('Failed to parse message:', error);
    //     }
    // };

    // ws.onclose = () => {
    //     console.warn('WebSocket connection closed');
    //     store.dispatch({ type: 'users/logout_success' });
    // };

    // ws.onerror = (error) => {
    //     console.error('WebSocket error:', error);
    // };

    return (next: Dispatch) => (action: UnknownAction) => {
        const pluginContext: PluginContext = {
            dispatch: store.dispatch,
            getState: () => ({
                ...store.getState(),
                plugins: pm.getAllPluginStates(),
            }),
            getPluginState: pm.getPluginState,
        };

        const chain = pm.getPlugins().map((plugin) => plugin.middleware(pluginContext));
        return compose<Dispatch>(...chain.reverse())(next)(action);
    };
};

// 处理接收到的action
function handleReceivedAction(store: MiddlewareAPI, pluginManager: PluginManager, action: any) {
    // 更新插件状态
    pluginManager.getPlugins().forEach((plugin) => {
        const currentState = pluginManager.getPluginState(plugin.name);
        const newState = plugin.reducer(currentState, action);
        pluginManager.setPluginState(plugin.name, newState);
    });

    // 分发action到store
    store.dispatch(action);
}

export default websocket;
