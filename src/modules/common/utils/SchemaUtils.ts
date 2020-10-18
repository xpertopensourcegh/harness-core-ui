import { LOCAL_API_PORT } from 'modules/common/constants/Common'

const isLocalHost = (location: Location) => {
  return location.hostname === 'localhost' || location.hostname === '127.0.0.1'
}

const getHostPrefix = (location: Location): string => {
  let hostname = location.hostname
  if (isLocalHost(location)) {
    hostname = hostname + ':' + LOCAL_API_PORT
  }
  return hostname
}

const getRefUrlPrefix = (location: Location): string => {
  const protocol = (isLocalHost(location) ? 'http' : location.protocol) + ':'
  return protocol + '//' + encodeURIComponent(getHostPrefix(location))
}

export { getRefUrlPrefix }
