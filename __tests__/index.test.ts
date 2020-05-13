import { TopologyMap, createDeviceDispatchable } from '@iotes/core'
import { create, act } from 'react-test-renderer'
import React, { FC, useEffect } from 'react'
import Redux, { createStore, applyMiddleware } from 'redux'
import { createLocalStoreAndStrategy } from './utils/strategies/local'
import { createIotesReactReduxHook } from '../src/index'

const el = React.createElement

// Test data
const testTopologoy: TopologyMap<any, 'RFID_READER' | 'ROTARY_ENCODER'> = {
  hosts: [{ name: 'testapp/0', host: 'localhost', port: '8888' }],
  client: { name: 'test' },
  devices: [
    {
      hostName: 'testapp/0',
      type: 'RFID_READER',
      name: 'READER/1',
      channel: 1,
    },
    {
      hostName: 'testapp/0',
      type: 'ROTARY_ENCODER',
      name: 'ENCODER/1',
      channel: 2,
    },
  ],
}

let reduxStore: Redux.Store
let iotes: any
let localStore: any
let createLocalStrategy: any
let TestRender: any
let testRoot: any
let TestComponent: FC
const oe = console.error

describe('React Hooks ', () => {
  beforeAll(() => {
    console.error = jest.fn()
  })
  // Set up
  beforeEach(() => {
    const { hosts } = testTopologoy

    const genericReducer: Redux.Reducer = (state = {}, action) => {
      if (action.type === 'IOTES_HOST') {
        return { ...state, ...action.payload }
      }
      return state
    };

    [localStore, createLocalStrategy] = createLocalStoreAndStrategy()
    const [useIotesDevice, iotesHostMiddleware] = createIotesReactReduxHook(
      testTopologoy,
      createLocalStrategy,
    )
    reduxStore = createStore(
      genericReducer,
      applyMiddleware(iotesHostMiddleware),
    )

    TestComponent = () => {
      const [deviceVal, setDeviceVal] = useIotesDevice()

      useEffect(() => {
        setTimeout(
          () => setDeviceVal(
            createDeviceDispatchable('ENCODER/1', 'UPDATE', {
              message: 'dispatched from component',
            }),
          ),
          1000,
        )
      })

      return el(React.Fragment, null, [
        el('div', { key: 1 }, `${JSON.stringify(deviceVal)}`),
      ])
    }

    act(() => {
      testRoot = create(el(TestComponent, null, null))
    })
  })

  afterEach(() => {
    localStore = null
  })

  // Tests
  test('Can intergrate with react hooks and receive host updates ', async () => {
    // Surpress console errors to stop act errors logging as state
    // update within iotes cannot use act method from test tenderer
    console.error = jest.fn()

    await new Promise((res) => {
      setTimeout(() => res(), 20)
    })

    expect(reduxStore.getState()['testapp/0'].type).toBe('CONNECT')
  })

  test('Can intergrate with react hooks and receive device updates ', async () => {
    expect(testRoot.toJSON()).not.toBe(null)

    const { devices } = testTopologoy

    // Surpress console errors to stop act errors logging as state
    // update within iotes cannot use act method from test tenderer
    console.error = jest.fn()

    const newComponent: any = await new Promise((res) => {
      setTimeout(() => res(testRoot.toJSON()), 50)
    })

    const newEventFromHook = JSON.parse(newComponent.children)

    console.log(newEventFromHook)

    // Dynamically adjust to given test topology
    expect(
      Object.keys(newEventFromHook).filter((e) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const d of devices) {
          if (e === d.name) return true
        }

        return false
      }).length,
    ).toEqual(devices.length)
  })
})
