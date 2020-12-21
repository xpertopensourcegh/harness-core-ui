import type { AppStoreContextProps } from 'framework/AppStore/AppStoreContext'
import type { Project } from 'services/cd-ng'

export const project: Project = {
  accountIdentifier: 'testAcc',
  orgIdentifier: 'testOrg',
  identifier: 'test',
  name: 'test',
  color: '#e6b800',
  modules: ['CD', 'CV'],
  description: 'test',
  tags: { tag1: '', tag2: 'tag3' }
}
export const defaultAppStoreValues: Pick<AppStoreContextProps, 'selectedProject'> = {
  selectedProject: {
    accountIdentifier: 'testAcc',
    orgIdentifier: 'testOrg',
    identifier: 'test',
    name: 'test',
    color: '#e6b800',
    modules: ['CD', 'CV', 'CI', 'CE', 'CF'],
    description: 'test',
    tags: { tag1: '', tag2: 'tag3' }
  }
}
