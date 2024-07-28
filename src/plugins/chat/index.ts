import chatReducer from './chat_reducer';
import middleware from './middleware';
import Component from './ChatWindow';
import { Plugin } from '@/core/plugin_manager';

const plugin: Plugin = {
    name: 'chat',
    // @ts-ignore
    reducer: chatReducer.reducer,
    component: Component,
    middleware,
};

export default plugin;
