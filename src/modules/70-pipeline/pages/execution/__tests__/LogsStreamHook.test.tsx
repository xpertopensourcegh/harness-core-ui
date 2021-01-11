import { EventSourcePolyfill } from 'event-source-polyfill'
import { act, renderHook } from '@testing-library/react-hooks'
import { useLogsStream } from '../LogsStreamHook'

jest.mock('event-source-polyfill', () => ({
  EventSourcePolyfill: jest.fn()
}))

const getQueryVar = () => ({
  accountID: 'accountID',
  key: 'key',
  'X-Harness-Token': 'X-Harness-Token'
})

describe('useLogsStream hook tests', () => {
  test('should renders properly with default values', () => {
    const queryVars = getQueryVar()
    const { result } = renderHook(() => useLogsStream(queryVars))
    expect(result.current.logs).toStrictEqual([])
  })

  test('should add logs to "logs" array', async () => {
    let lastInstance: any
    const eventSourceMock = EventSourcePolyfill.mockImplementation(
      jest.fn(function () {
        lastInstance = {
          readyState: 0,
          close: jest.fn(),
          onmessage: jest.fn(),
          onerror: jest.fn()
        }
        return lastInstance
      })
    )

    const queryVars = getQueryVar()
    const { result } = renderHook(() => useLogsStream(queryVars))

    await act(async () => {
      result.current.setEnableStreaming(true)
      await new Promise(r => setTimeout(r, 10))
      lastInstance.onmessage({ data: JSON.stringify({ out: 'message 1' }) })
    })

    expect(result.current.logs).toEqual([{ out: 'message 1' }])

    eventSourceMock.mockRestore()
  })
})
