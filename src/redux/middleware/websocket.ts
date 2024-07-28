// src/store/websocketMiddleware.ts
import { Dispatch, MiddlewareAPI } from '@reduxjs/toolkit';
import ReconnectingWebSocket, { Message, CloseEvent } from 'reconnecting-websocket';
import { v4 as uuidv4 } from 'uuid';
import { message, notification } from 'antd';

import { FAIL_END, IAction, ICallback, IServerAction, SUCCESS_END } from '@/core/base';
import { connected, disconnected } from './wsSlice';
import { skips } from '@/settings/system';

function afterWebsockeClosed(dispatch: Dispatch) {
    dispatch({ type: 'users/logout_success' });
}

const createWebSocketMiddleware = (url: string) => {
    // pool 作为callback注册地
    const pool = new Map();

    let ws: ReconnectingWebSocket = new ReconnectingWebSocket(url, undefined, { debug: true });

    return ({ dispatch }: MiddlewareAPI) => {
        ws.onopen = () => {
            console.log('ws.onopen', dispatch);
            dispatch(connected());
        };
        ws.onmessage = (e: MessageEvent) => {
            if (typeof e.data === 'string') {
                const action = JSON.parse(e.data) as IServerAction;
                console.log('received from websocket:', action);

                let callback = pool.get(action.uuid);
                dispatch_action_from_server(dispatch, action, callback);
                pool.delete(action.uuid);
            } else {
                throw new Error(`not string data from sever: ${typeof e.data}`);
            }
        };
        ws.onclose = (e: CloseEvent) => {
            console.warn('logout');
            afterWebsockeClosed(dispatch);
            dispatch(disconnected());
        };

        return (next: Dispatch) => (action: IAction) => {
            console.log('type', action);

            if (action.type === 'ws/sendMessage') {
                let uuid = '';
                if (action.meta && action.meta.success) {
                    uuid = uuidv4();
                    pool.set(uuid, action.meta);
                }
                sendToServer(ws, action, uuid);
            } else {
                return next(action as any);
            }
        };
    };
};

// 将action删除fn,重新构造发送给服务端
function sendToServer(ws: ReconnectingWebSocket, action: IAction, uuid: string): void {
    const { token, hash, ...payload } = action.payload.payload;
    const data = {
        type: action.payload.type,
        payload,
        uuid,
        token,
        hash,
    };
    console.log('action send to server', action, 'data', data);
    waitForWebsocketReadyToSend(ws, JSON.stringify(data));
}

function waitForWebsocketReadyToSend(ws: ReconnectingWebSocket, msg: Message) {
    setTimeout(() => {
        switch (ws.readyState) {
            case 0:
                waitForWebsocketReadyToSend(ws, msg);
                break;
            case 1:
                ws.send(msg);
                break;
            default:
                console.debug('the websocket is closing or closed');
        }
    }, 50);
}

function dispatch_action_from_server(
    dispatch: Dispatch,
    action: IServerAction,
    callback?: ICallback
) {
    dispatch(action as any);

    if (action.type.endsWith(SUCCESS_END)) {
        if (callback && callback.success) {
            callback.success(action);
        }

        if (!skips.some((skip) => action.type.endsWith(skip)) && action.payload.silence !== true) {
            message.success(
                `${action.type.replace(/[\/\_]/, ' ')}\n${
                    action.payload.msg ? action.payload.msg : ''
                }`
            );
        }
    } else if (action.type.endsWith(FAIL_END)) {
        console.log('action.type', action.type);
        if (callback && callback.fail) {
            callback.fail(action);
        }

        notification.error({
            message: action.type,
            description: action.payload.err,
        });
    }
}

export default createWebSocketMiddleware;
