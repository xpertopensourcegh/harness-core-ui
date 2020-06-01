import xhr from '@wings-software/xhr-async'
import AppStorage from 'framework/utils/AppStorage'

///////////////// This section needs to move out //////////////////
interface CustomWindow extends Window {
  apiUrl?: string
}

const getApiBaseUrl = (): string => {
  const {
    apiUrl,
    location: { hostname, port }
  } = window as CustomWindow

  return apiUrl ? apiUrl : port === '8000' || port === '8181' ? `http://${hostname}:7457` : '/api'
}

xhr.defaults.baseURL = getApiBaseUrl()

xhr.before(({ headers }) => {
  if (AppStorage.get('token') && headers) {
    headers.authorization = 'Bearer ' + AppStorage.get('token')
  }
})
/////////////////////////////////////////////////////////////////
