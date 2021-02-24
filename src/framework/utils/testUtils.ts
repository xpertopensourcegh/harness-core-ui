import strings from 'strings/strings.en.yaml'
import type { AppStoreContextProps } from 'framework/AppStore/AppStoreContext'

export const defaultAppStoreTestData: AppStoreContextProps = {
  strings,
  featureFlags: {},
  permissions: [],
  updateAppStore: jest.fn()
}
