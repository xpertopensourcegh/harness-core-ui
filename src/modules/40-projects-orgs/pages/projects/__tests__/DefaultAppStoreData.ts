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
export const defaultAppStoreValues: Pick<AppStoreContextProps, 'user' | 'projects' | 'organisationsMap'> = {
  user: {},
  projects: [
    {
      accountIdentifier: 'testAcc',
      orgIdentifier: 'testOrg',
      identifier: 'test',
      name: 'test',
      color: '#e6b800',
      modules: ['CD'],
      description: 'test',
      tags: { tag1: '', tag2: 'tag3' },
      lastModifiedAt: 1599715118275
    },
    {
      accountIdentifier: 'testAcc',
      orgIdentifier: 'Cisco_Meraki',
      identifier: 'Online_Banking',
      name: 'Online Banking',
      color: '#1c1c28',
      modules: ['CD', 'CV'],
      description: 'UI for the Payment',
      tags: { tag1: '', tag2: 'tag3' },
      lastModifiedAt: 1599715118275
    },
    {
      accountIdentifier: 'testAcc',
      orgIdentifier: 'Cisco_Meraki',
      identifier: 'Portal',
      name: 'Portal',
      color: '#ff8800',
      modules: ['CV'],
      description: 'Online users',
      tags: { tag1: '', tag2: 'tag3' },
      lastModifiedAt: 1599715155888
    },
    {
      accountIdentifier: 'testAcc',
      orgIdentifier: 'Cisco_Prime',
      identifier: 'Project_1',
      name: 'Project 1',
      color: '#e6b800',
      modules: [],
      description: '',
      tags: {},
      lastModifiedAt: 1599740365287
    },
    {
      accountIdentifier: 'testAcc',
      orgIdentifier: 'Cisco_Prime',
      identifier: 'Project_Demo',
      name: 'Project Demo',
      color: '#004fc4',
      modules: [],
      description: 'Demo project',
      tags: { tag1: '', tag2: 'tag3' },
      lastModifiedAt: 1599730109213
    },
    {
      accountIdentifier: 'testAcc',
      orgIdentifier: 'Harness',
      identifier: 'Drone_Data_Supplier',
      name: 'Drone Data Supplier',
      color: '#e67a00',
      modules: ['CD', 'CV', 'CI', 'CE', 'CF'],
      description: 'Drone',
      tags: { tag1: '', tag2: 'tag3' },
      lastModifiedAt: 1599715251972
    },
    {
      accountIdentifier: 'testAcc',
      orgIdentifier: 'Harness',
      identifier: 'Swagger',
      name: 'Swagger',
      color: '#e6b800',
      modules: ['CI'],
      description: 'Swagger 2.0',
      tags: { tag1: '', tag2: 'tag3' },
      lastModifiedAt: 1599715290787
    }
  ],
  organisationsMap: new Map([
    [
      'testOrg',
      {
        accountIdentifier: 'testAcc',
        identifier: 'testOrg',
        name: 'Org Name'
      }
    ]
  ])
}
