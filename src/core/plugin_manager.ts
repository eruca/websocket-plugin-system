// src/store/PluginManager.ts
import { Dispatch, Middleware, Reducer } from '@reduxjs/toolkit';

import dynamicReducersStore, { AppAction, AppState } from './dynamic_reducer_store';

export interface Plugin {
    name: string;
    reducer: Reducer<any, AppAction>;
    component: React.ComponentType;
    middleware?: Middleware;
}

export interface PluginContext {
    dispatch: Dispatch;
    getState: () => AppState;
    getPluginState: (pluginName: string) => any;
}

class PluginManager {
    private plugins: Plugin[] = [];

    registerPlugin(plugin: Plugin) {
        this.plugins.push(plugin);

        if (plugin.reducer) {
            dynamicReducersStore.injectReducer(plugin.name, plugin.reducer);
        }
        if (plugin.middleware) {
            dynamicReducersStore.reconfigureStore();
        }
    }

    getPlugins() {
        return this.plugins;
    }
}

const pluginManager = new PluginManager();
export default pluginManager;
