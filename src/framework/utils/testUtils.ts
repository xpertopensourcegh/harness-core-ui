import type { AppStoreContextProps } from 'framework/AppStore/AppStoreContext'

export const defaultAppStoreTestData: AppStoreContextProps = {
  featureFlags: {},
  permissions: [],
  updateAppStore: jest.fn()
}
