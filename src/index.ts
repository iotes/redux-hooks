import {
  createIotes as createIotesCore,
  Strategy,
  TopologyMap,
  Selector,
  State,
  DeviceDispatchable,
} from '@iotes/core'
import Redux from 'redux'
import { useState, useEffect } from 'react'

type Hook = (
  selector?: string[],
) => [any, <Payload>(dispatchable: DeviceDispatchable<Payload>) => void]

export type IotesReactReduxHook = [Hook, Redux.Middleware]

export const createIotes = (
  topology: TopologyMap<any, any>,
  strategy: Strategy<any, any>,
  reduxType: string = 'IOTES_HOST',
  busType?: string,
): IotesReactReduxHook => {
  const iotes = createIotesCore({ topology, strategy })

  const {
    hostDispatch, deviceDispatch, hostSubscribe, deviceSubscribe,
  } = iotes

  const createHook = (
    subscribe: any,
    dispatch: (state: State) => void,
    selector?: Selector,
  ): [any, <Payload>(
      dispatchable: DeviceDispatchable<Payload>
    ) => void] => {
    const [state, setState] = useState({})

    useEffect(() => {
      subscribe((iotesState: any) => {
        setState(iotesState)
      })
    }, [])

    return [state, dispatch]
  }

  const useIotesDevice:Hook = (selector: string[]) => (
    createHook(deviceSubscribe, deviceDispatch, selector)
  )

  const iotesHostMiddleware: Redux.Middleware = (store) => {
    hostSubscribe((state: State) => {
      store.dispatch({
        type: reduxType,
        bus: busType || reduxType,
        payload: state,
      })
    })

    return (next) => (action: Redux.AnyAction) => {
      if (action.iotes === reduxType) hostDispatch(action)
      next(action)
    }
  }

  return [useIotesDevice, iotesHostMiddleware]
}
