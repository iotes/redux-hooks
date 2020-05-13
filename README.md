## Introduction

This Plugin intergrates iotes with redux projects. This is the recommended plugin to use for redux based projects for most cases as opposed to iotes-react-redux.

In this plugin the host updates get dispatched through the redux dispatch system while the device data comes from a useIotesDevice hook. This means you can handle big events like connection and disconnection of devices through the redux store without causing an excessive amount of actions to come through on the redux store

## Usage

```typescript
    // Create iotes plugin
    const { useIotesDevice, iotesHostMiddleware, subscribeToHost } = createIotesReactReduxHook(topology, strategy)
    // create store applying middleware
    const store = createStore(genericReducer, applyMiddleware(iotesHostMiddleware))
    // inject the store dispatcher in order to subscribe to iotes host
    subscribeToHost(store.dispatch)  

```