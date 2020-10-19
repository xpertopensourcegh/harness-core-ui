import { LOCAL_API_PORT } from 'modules/common/constants/Common'
import { getRefUrlPrefix } from '../SchemaUtils'

const setupMockLocationObj = (hostname: string, protocol: string, port = '') => {
  const location: Location = {
    ancestorOrigins: window.location.ancestorOrigins,
    hash: '',
    host: `${hostname}:${port}`,
    hostname,
    href: 'www.sample.com',
    origin: 'www.sample.com',
    pathname: '',
    port,
    protocol,
    search: '',
    assign: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn()
  }
  return location
}

describe('schema utils', () => {
  test('test getRefUrlPrefix for localhost', () => {
    const hostName = 'localhost'
    const mockedLocation = setupMockLocationObj(hostName, 'http', LOCAL_API_PORT)
    const refUrlPrefix = getRefUrlPrefix(mockedLocation)
    expect(refUrlPrefix).toEqual(`http://${hostName}%3A${LOCAL_API_PORT}`)
  })

  test('test getRefUrlPrefix for QB env', () => {
    const hostName = 'qb.harness.io',
      protocol = 'https'
    const mockedLocation = setupMockLocationObj(hostName, protocol)
    const refUrlPrefix = getRefUrlPrefix(mockedLocation)
    expect(refUrlPrefix).toEqual(`${protocol}//${hostName}`)
  })
})
