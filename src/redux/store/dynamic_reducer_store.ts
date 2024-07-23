import {
    configureStore,
    combineReducers,
    Reducer,
    AnyAction,
    Dispatch,
    compose,
} from '@reduxjs/toolkit';

import websocket from '@/redux/middleware/websocket';
import { PluginManager } from '@/core/plugin_manager';
import { Plugin, PluginContext } from '@/core/plugin';

export interface AppState {
    // 定义全局状态结构
    [key: string]: any;
}

// Reducers 映射的类型定义
type ReducersMap = { [key: string]: Reducer<AppState, AnyAction> };

export default class DynamicReducersStore {
    private store: ReturnType<typeof configureStore>;
    private asyncReducers: ReducersMap = {};
    private pluginManager: PluginManager;

    constructor() {
        this.pluginManager = new PluginManager();

        const rootReducer: Reducer<AppState, AnyAction> = (state = {}, action) => state;

        this.store = configureStore({
            reducer: rootReducer,
            // @ts-ignore
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware().concat(
                    websocket(this.pluginManager),
                    this.createPluginMiddleware()
                ),
        });
    }

    registerPlugin(plugin: Plugin) {
        this.pluginManager.registerPlugin(plugin);
        this.injectReducer(plugin.name, plugin.reducer);
    }

    injectReducer(key: string, asyncReducer: Reducer<any, AnyAction>) {
        if (!this.asyncReducers[key]) {
            console.log('injectReducer', key);
            this.asyncReducers[key] = asyncReducer;
            this.updateReducers();
        } else {
            throw new Error(`${key} already exists`);
        }
    }

    private updateReducers() {
        console.log('updateReducer');
        // 使用 combineReducers 和现有的 asyncReducers 创建新的 rootReducer
        const rootReducer = combineReducers({
            ...this.asyncReducers,
        });
        // 使用 AppState 和 AnyAction 明确类型
        this.store.replaceReducer(rootReducer as any);
    }

    private createPluginMiddleware() {
        return (storeAPI: { dispatch: Dispatch; getState: () => any }) =>
            (next: Dispatch) =>
            (action: AnyAction) => {
                console.log('createPluginMiddleware', action);

                const pluginContext: PluginContext = {
                    dispatch: storeAPI.dispatch,
                    getState: () => ({
                        ...storeAPI.getState(),
                        plugins: this.pluginManager.getAllPluginStates(),
                    }),
                    getPluginState: (pluginName: string) =>
                        this.pluginManager.getPluginState(pluginName),
                };

                const chain = this.pluginManager
                    .getPlugins()
                    .map((plugin) => plugin.middleware(pluginContext));

                return compose<Dispatch>(...chain.reverse())(next)(action);
            };
    }

    getStore() {
        return this.store;
    }
}
