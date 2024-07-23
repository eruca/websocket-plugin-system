// store.ts
import DynamicReducerStore from './dynamic_reducer_store';
import chatPlugin from '@/plugins/chat/chat_plugin';

const dynamicStore = new DynamicReducerStore();
dynamicStore.registerPlugin(chatPlugin);

const store = dynamicStore.getStore();

export { store, dynamicStore };
