import { configureStore, combineReducers, Reducer, UnknownAction } from '@reduxjs/toolkit';

interface AppState {
    // 定义全局状态结构
    [key: string]: any;
}

// Reducers 映射的类型定义
type ReducersMap = { [key: string]: Reducer<any, UnknownAction> };

export default class DynamicReducersStore {
    private store: ReturnType<typeof configureStore>;
    private asyncReducers: ReducersMap = {};

    constructor() {
        this.store = configureStore({
            reducer: (state: AppState = {}, action: UnknownAction) => state,
        });
    }

    injectReducer(key: string, asyncReducer: Reducer<any, UnknownAction>) {
        if (!this.asyncReducers[key]) {
            this.asyncReducers[key] = asyncReducer;
            this.updateReducers();
        } else {
            throw new Error(`${key} already exists`);
        }
    }

    private updateReducers() {
        // 使用 AppState 和 UnknownAction 明确类型
        this.store.replaceReducer(combineReducers(this.asyncReducers) as any);
    }

    getStore() {
        return this.store;
    }
}
