import { Dispatch } from '@reduxjs/toolkit';
import { IAction } from '@/types/Action';

export interface PluginState {
    [key: string]: any;
}

export interface PluginProps {
    dispatch: Dispatch;
    getState: () => any;
}

export interface Plugin {
    name: string;
    initialState: PluginState;
    reducer: (state: PluginState, action: IAction) => PluginState;
    middleware: (
        props: PluginProps
    ) => (next: Dispatch) => (action: IAction) => any;
    component?: React.ComponentType<PluginProps & PluginState>;
}
