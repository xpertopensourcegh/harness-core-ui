import AppStorage from './AppStorage'

export default {
  isAuthenticated: () => AppStorage.has('token'),
  getToken: () => AppStorage.get('token'),
  username: () => AppStorage.get('username'),
  accountId: () => AppStorage.get('acctId')
}
