import AppStorage from 'framework/AppStorage'

const Authentication = {
  isAuthenticated: () => AppStorage.has('token')
}

export default Authentication
