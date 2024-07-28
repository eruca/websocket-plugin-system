import dayjs from 'dayjs';

// remote server 服务器请求
export const SERVER_REQUEST = 'SERVER_REQUEST';
// http 服务器请求
export const HTTP_REQUEST = 'HTTP_REQUEST';
// websocket 服务器请求
export const WEBSOCKET_REQUEST = 'WEBSOCKET_REQUEST';

export const SUCCESS_END = '_success';
export const FAIL_END = '_failure';

export interface IKey<T extends dayjs.Dayjs | string = string> {
    id: number;
    seq?: number;
    created_at?: T;
    updated_at?: T;
    version?: number;
}

// 验证是否是update
export function assert_update(id?: number) {
    if (!id) {
        throw new Error('update must set the id');
    }
}

export interface IQuery {
    offset: number;
    size: number;
    conds: string[];
    orderby: string;
}

export interface IQueryRequest extends IQuery {
    force_updated: boolean;
}

export interface ICallback {
    success?: (data: any) => void;
    fail?: (data: any) => void;
}

export interface IToken {
    token: string;
}

export interface IHash {
    hash: string;
}

export interface IServerAction {
    type: string;
    payload: Record<string, any>;
    uuid?: string;
    token: string;
}

export interface IAction<P = Record<string, any>> {
    type: string;
    payload: P;
    meta?: ICallback;
}

// export const onWebsocketServer = createAction(WEBSOCKET_REQUEST)<Actions, ICallback | undefined>();

// export const onHttpServer = createAction(HTTP_REQUEST)<Actions, ICallback | undefined>();

// export const onServerRequest = (
//     type: 'http' | 'websocket',
//     actions: Actions,
//     success?: (data: any) => void,
//     fail?: (data: any) => void
// ) => {
//     const fn = type === 'http' ? onHttpServer : onWebsocketServer;
//     return fn(actions, success || fail ? { success, fail } : undefined);
// };
