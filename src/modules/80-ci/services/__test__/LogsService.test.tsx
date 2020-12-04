import { waitFor } from '@testing-library/react'
import { downloadLogs, getLogsFromBlob } from '../LogService'

describe('LogsService::getLogsFromBlob', () => {
  const logResponse = (): string => {
    const logRow1 = {
      level: 'info',
      time: '123',
      out: 'log message'
    }
    const logRow2 = {}
    const logRow3 = ''
    const logRow4 = {
      level: 'info',
      out: 'log message'
    }

    return (
      JSON.stringify(logRow1) +
      '\n' +
      JSON.stringify(logRow2) +
      '\n' +
      JSON.stringify(logRow3) +
      '\n' +
      JSON.stringify(logRow4)
    )
  }

  test('should call setLogs()', async () => {
    const fetchMock = jest.spyOn(global, 'fetch' as any)
    fetchMock.mockResolvedValue({
      text: () => new Promise(resolve => resolve(logResponse()))
    })

    const setLogs = jest.fn(() => ({}))
    getLogsFromBlob(
      'token',
      'accountIdentifier',
      'orgIdentifier',
      'projectIdentifier',
      'buildIdentifier',
      'stageIdentifier',
      'stepIdentifier',
      setLogs
    )

    await waitFor(() => expect(setLogs).toBeCalled())

    fetchMock.mockRestore()
  })

  test('should throw error', async () => {
    const fetchMock = jest.spyOn(global, 'fetch' as any)
    fetchMock.mockResolvedValue({
      text: () => new Promise(resolve => resolve('wrong format'))
    })

    try {
      getLogsFromBlob(
        'token',
        'accountIdentifier',
        'orgIdentifier',
        'projectIdentifier',
        'buildIdentifier',
        'stageIdentifier',
        'stepIdentifier',
        jest.fn()
      )
    } catch (ex) {
      expect(true)
    }

    fetchMock.mockRestore()
  })
})

describe('LogsService::downloadLogs', () => {
  test('should call click()', async () => {
    // NOTE: createObjectURL does not exist in test env.
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = jest.fn()
    }

    const clickFn = jest.fn(() => ({}))

    const fetchMock = jest.spyOn(global, 'fetch' as any)
    fetchMock.mockResolvedValue({
      blob: () => new Promise(resolve => resolve({}))
    })

    const urlMock = jest.spyOn(window.URL, 'createObjectURL')
    urlMock.mockImplementation(() => '')

    const documentMock = jest.spyOn(document, 'createElement')
    documentMock.mockImplementation(() => ({ click: clickFn as any } as HTMLElement))

    downloadLogs(
      'token',
      'accountIdentifier',
      'orgIdentifier',
      'projectIdentifier',
      'buildIdentifier',
      'stageIdentifier',
      'stepIdentifier'
    )

    await waitFor(() => expect(clickFn).toBeCalled())

    fetchMock.mockRestore()
    urlMock.mockRestore()
    documentMock.mockRestore()
  })
})
