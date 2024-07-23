import { Plugin } from './plugin';

export class PluginManager {
    private plugins: Record<string, Plugin> = {};
    private pluginStates: Record<string, any> = {};

    registerPlugin(plugin: Plugin) {
        this.plugins[plugin.name] = plugin;
        this.pluginStates[plugin.name] = undefined;
    }

    getPlugins(): Plugin[] {
        return Object.values(this.plugins);
    }

    getPluginState(pluginName: string): any {
        return this.pluginStates[pluginName];
    }

    setPluginState(pluginName: string, state: any) {
        this.pluginStates[pluginName] = state;
    }

    getAllPluginStates(): Record<string, any> {
        return this.pluginStates;
    }
}
