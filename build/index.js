"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@iotes/core");
const react_1 = require("react");
exports.createIotes = (topology, strategy, reduxType = 'IOTES_HOST', busType) => {
    const iotes = core_1.createIotes({ topology, strategy });
    const { hostDispatch, deviceDispatch, hostSubscribe, deviceSubscribe, } = iotes;
    const createHook = (subscribe, dispatch, selector) => {
        const [state, setState] = react_1.useState({});
        react_1.useEffect(() => {
            subscribe((iotesState) => {
                setState(iotesState);
            });
        }, []);
        return [state, dispatch];
    };
    const useIotesDevice = (selector) => (createHook(deviceSubscribe, deviceDispatch, selector));
    const iotesHostMiddleware = (store) => {
        hostSubscribe((state) => {
            store.dispatch({
                type: reduxType,
                bus: busType || reduxType,
                payload: state,
            });
        });
        return (next) => (action) => {
            if (action.iotes === reduxType)
                hostDispatch(action);
            next(action);
        };
    };
    return [useIotesDevice, iotesHostMiddleware];
};
//# sourceMappingURL=index.js.map