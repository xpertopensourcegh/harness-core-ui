import xhr from '@wings-software/xhr-async'
import AppStorage from 'common/AppStorage'

///////////////// This section needs to move out //////////////////
interface CustomWindow extends Window {
  apiUrl?: string
}

const getApiBaseUrl = (): string => {
  const {
    apiUrl,
    location: { protocol, hostname, port }
  } = window as CustomWindow

  return apiUrl ? apiUrl : port === '8000' || port === '8181' ? `${protocol}//${hostname}:9090/api` : '/api'
}

xhr.defaults.baseURL = getApiBaseUrl()

xhr.before(({ headers }) => {
  if (AppStorage.get('token') && headers) {
    headers.authorization = 'Bearer ' + AppStorage.get('token')
  }
})
/////////////////////////////////////////////////////////////////

export function getUsers({ accountId }: { accountId: string }): unknown {
  return xhr.get(`users?accountId=${accountId}`)
}
