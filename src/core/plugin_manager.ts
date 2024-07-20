import { Some, Option, None, Result, Err, Ok } from 'ts-results';

import { IPagePlugin, IPlugin } from './plugin';
import DynamicReducersStore from '@/redux/store/store';

export default class PluginManager {
    private plugins = new Map<string, IPlugin | IPagePlugin>(); // id to plugin
    private routeToId = new Map<string, string>(); // route to plugin id
    private store: DynamicReducersStore;

    constructor(store: DynamicReducersStore) {
        this.store = store;
    }

    register_plugin(plugin: IPlugin) {
        if (this.plugins.has(plugin.id)) {
            throw new Error(`Plugin ${plugin.id} is already registered.`);
        }
        this.plugins.set(plugin.id, plugin);
        this.store.injectReducer(plugin.id, plugin.reducer);
    }

    register_page(page: IPagePlugin) {
        this.register_plugin(page);
        this.routeToId.set(page.routePath, page.id);
    }

    initAll() {
        this.plugins.forEach((plugin) => {
            if (this.areDependenciesResolved(plugin)) {
                plugin.init(this.store.getStore());
            } else {
                throw new Error(`Dependencies for plugin ${plugin.id} are not resolved.`);
            }
        });
    }

    getAllPlugins(): IterableIterator<IPlugin> {
        return this.plugins.values();
    }

    getAllPages(): Array<IPagePlugin> {
        return Array.from(this.routeToId.values()).map((id) => this.plugins.get(id) as IPagePlugin);
    }

    getPluginForRoute(routePath: string): Option<IPlugin> {
        const pluginId = this.routeToId.get(routePath);
        if (pluginId) {
            const p = this.plugins.get(pluginId);
            if (p) {
                return Some(p);
            }
        }
        return None;
    }

    areDependenciesResolved(plugin: IPlugin): boolean {
        return plugin.dependencies.every((dep) => this.plugins.has(dep));
    }

    getComponentById(id: string): Result<React.ComponentType<any>, Error> {
        const plugin = this.plugins.get(id);
        if (!plugin) {
            return Err(new Error(`Plugin ${id} not found.`));
        }
        return Ok(plugin.getComponent());
    }

    getStateById(id: string): Result<any, Error> {
        const plugin = this.plugins.get(id);
        if (!plugin) {
            return Err(new Error(`Plugin ${id} not found.`));
        }
        return Ok(plugin.getState());
    }

    updatePlugin(id: string, changes: any) {
        const plugin = this.plugins.get(id);
        if (plugin) {
            plugin.update(changes);
        }
    }

    destroyPlugin(id: string) {
        const plugin = this.plugins.get(id);
        if (plugin) {
            plugin.destroy();
            this.plugins.delete(id);
        }
    }
}
