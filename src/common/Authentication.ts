import AppStorage from 'common/AppStorage'

const Authentication = {
  isAuthenticated: () => AppStorage.has('token')
}

export default Authentication
