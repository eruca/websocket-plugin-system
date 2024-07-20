import ReconnectingWebSocket from 'reconnecting-websocket';
import { Middleware, MiddlewareAPI, Dispatch, compose, UnknownAction } from '@reduxjs/toolkit';

import { websocketAddr } from '@/settings/system';
import { PluginManager } from '@/core/plugin_manager';
import { PluginContext } from '@/core/plugin';

const websocket: Middleware = (store: MiddlewareAPI) => {
    const pluginManager = new PluginManager();

    const ws = new ReconnectingWebSocket(websocketAddr, undefined, {
        debug: true,
    });

    ws.onmessage = (e: MessageEvent) => {
        if (typeof e.data === 'string') {
            const action = JSON.parse(e.data) as IServerAction;
            console.log('received from websocket:', action);

            // 处理接收到的消息
            handleReceivedAction(store, pluginManager, action);
        }
    };

    ws.onclose = () => {
        console.warn('logout');
        store.dispatch({ type: 'users/logout_success' });
    };

    // return (next: Dispatch) => (action: UnknownAction) => {
    //     // 运行所有插件的中间件
    //     const chain = pluginManager.getPlugins().map((plugin) =>
    //         plugin.middleware({
    //             dispatch: store.dispatch,
    //             getState: () => ({
    //                 ...store.getState(),
    //                 plugins: {
    //                     [plugin.name]: pluginManager.getPluginState(plugin.name),
    //                 },
    //             }),
    //         })
    //     );

    //     return compose<typeof next>(...chain)(next)(action);
    // };
    return (next: Dispatch) => (action: UnknownAction) => {
        const pluginContext: PluginContext = {
            dispatch: store.dispatch,
            getState: () => ({
                ...store.getState(),
                plugins: pluginManager.getAllPluginStates(),
            }),
            getPluginState: (pluginName: string) => pluginManager.getPluginState(pluginName),
        };

        const chain = pluginManager.getPlugins().map((plugin) => plugin.middleware(pluginContext));

        return compose<Dispatch>(next, ...chain.reverse())(action);
    };
};

// 处理接收到的action
function handleReceivedAction(
    store: MiddlewareAPI,
    pluginManager: PluginManager,
    action: UnknownAction
) {
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
