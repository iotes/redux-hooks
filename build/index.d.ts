import { Strategy, TopologyMap, DeviceDispatchable } from '@iotes/core';
import Redux from 'redux';
declare type Hook = (selector?: string[]) => [any, <Payload>(dispatchable: DeviceDispatchable<Payload>) => void];
export declare type IotesReactReduxHook = [Hook, Redux.Middleware];
export declare const createIotes: (topology: TopologyMap<any, any>, strategy: Strategy<any, any>, reduxType?: string, busType?: string) => IotesReactReduxHook;
export {};
