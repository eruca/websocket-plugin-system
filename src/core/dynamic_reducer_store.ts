// src/store/DynamicReducersStore.ts
import { configureStore, combineReducers, Reducer, PayloadAction } from '@reduxjs/toolkit';

import { websocketAddr } from '@/settings/system';
import pluginManager, { Plugin } from '@/core/plugin_manager';
import wsReducer from '@/core/wsSlice';
import createWsMiddleware from './websocket';

export interface AppState {
    ws: ReturnType<typeof wsReducer>;
    [key: string]: any;
}

export type AppAction<T = Record<string, any>> = PayloadAction<T>;

type ReducersMap = { [key: string]: Reducer<any, AppAction> };

const wsMiddleware = createWsMiddleware(websocketAddr);

class DynamicReducersStore {
    private store: ReturnType<typeof configureStore>;
    // @ts-ignore
    private asyncReducers: ReducersMap = { ws: wsReducer };
    private middlewares = [wsMiddleware];

    constructor() {
        this.store = configureStore({
            reducer: combineReducers(this.asyncReducers),
            // @ts-ignore
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware().concat(this.createMiddlewareChain()),
        });
    }

    injectReducer(key: string, asyncReducer: Reducer<any, AppAction>) {
        if (!this.asyncReducers[key]) {
            this.asyncReducers[key] = asyncReducer;
            this.updateReducers();
        }
    }

    private updateReducers() {
        this.store.replaceReducer(combineReducers(this.asyncReducers) as any);
    }

    reconfigureStore() {
        const currentState: any = this.store.getState();
        this.store = configureStore({
            reducer: combineReducers(this.asyncReducers),
            // @ts-ignore
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware().concat(this.createMiddlewareChain()),
            preloadedState: currentState,
        });
    }

    private createMiddlewareChain() {
        const pluginMiddlewares = pluginManager
            .getPlugins()
            .filter(
                (plugin): plugin is Plugin & { middleware: NonNullable<Plugin['middleware']> } =>
                    !!plugin.middleware
            )
            .map((plugin) => plugin.middleware);

        return [...this.middlewares, ...pluginMiddlewares];
    }

    getStore() {
        return this.store;
    }
}

const dynamicReducersStore = new DynamicReducersStore();
export default dynamicReducersStore;
