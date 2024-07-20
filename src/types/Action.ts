import { AnyAction } from '@reduxjs/toolkit/react';

export interface ICallback {
    success?: (data: any) => void;
    fail?: (data: any) => void;
}

export interface IAction<P = Record<string, any>> extends AnyAction {
    type: string;
    payload: P;
    meta?: ICallback;
}
