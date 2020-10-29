import xhr from '@wings-software/xhr-async'
// TODO: Limit access to AppStorage by providing a better mechanism to get the token
// AppStorage should not be exposed as it's a legacy
import AppStorage from 'framework/utils/AppStorage'

///////////////// This section needs to move out //////////////////
// interface CustomWindow extends Window {
//   apiUrl?: string
// }

// const getApiBaseUrl = (): string => {
//   const {
//     apiUrl,
//     location: { hostname, port }
//   } = window as CustomWindow

//   return apiUrl ? apiUrl : port === '8000' || port === '8181' ? `http://${hostname}:7457` : '/api'
// }

// xhr.defaults.baseURL = getApiBaseUrl()

xhr.before(({ headers }) => {
  if (AppStorage.get('token') && headers) {
    headers.authorization = 'Bearer ' + AppStorage.get('token')
  }

  // TODO Filter out `undefined` from POST/PUT requests
})
/////////////////////////////////////////////////////////////////
