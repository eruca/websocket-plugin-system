import { Reducer, Store } from '@reduxjs/toolkit';

export interface IPlugin<TState = any, TComponentProps = any> {
    id: string; // 唯一标识符
    dependencies: string[]; // 依赖的插件列表
    init: (store: Store) => void; // 初始化方法
    update: (changes: Partial<TState>) => void; // 更新状态的方法
    destroy: () => void; // 销毁方法，用于清理资源
    getComponent: () =>
        | React.LazyExoticComponent<React.ComponentType<TComponentProps>>
        | React.ComponentType<TComponentProps>; // 获取插件的 React 组件
    getState: () => any; // 获取插件的状态
    reducer: Reducer<TState>;
}

// 页面Plugin
export interface IPagePlugin<TState = any, TComponentProps = any>
    extends IPlugin<TState, TComponentProps> {
    routePath: string; // 路由路径
}
