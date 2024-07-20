// import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { PluginManager } from '@/redux/middleware/websocket';

// const PluginRenderer: React.FC = () => {
//     const dispatch = useDispatch();
//     const state = useSelector(state => state);
//     const plugins = PluginManager.getPlugins();

//     return (
//         <>
//             {plugins.map(plugin => {
//                 if (plugin.component) {
//                     const PluginComponent = plugin.component;
//                     const pluginState = PluginManager.getPluginState(plugin.name);
//                     return (
//                         <PluginComponent
//                             key={plugin.name}
//                             {...pluginState}
//                             dispatch={dispatch}
//                             getState={() => state}
//                         />
//                     );
//                 }
//                 return null;
//             })}
//         </>
//     );
// };

// export default PluginRenderer;