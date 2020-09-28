import type { AppStore } from 'framework/exports'
import type { Project } from 'services/cd-ng'

export const project: Project = {
  accountIdentifier: 'testAcc',
  orgIdentifier: 'testOrg',
  identifier: 'test',
  name: 'test',
  color: '#e6b800',
  modules: ['CD'],
  description: 'test',
  tags: ['tag1', 'tag2'],
  owners: ['testAcc']
}
export const defaultAppStoreValues: AppStore = {
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
      tags: ['tag1', 'tag2'],
      owners: ['testAcc']
    },
    {
      accountIdentifier: 'testAcc',
      orgIdentifier: 'testOrg',
      identifier: 'Online_Banking',
      name: 'Online Banking',
      color: '#1c1c28',
      modules: ['CD', 'CV'],
      description: 'UI for the Payment',
      owners: ['testAcc'],
      tags: ['UI', 'Production']
    },
    {
      accountIdentifier: 'testAcc',
      orgIdentifier: 'testOrg',
      identifier: 'Portal',
      name: 'Portal',
      color: '#ff8800',
      modules: ['CV'],
      description: 'Online users',
      owners: ['testAcc'],
      tags: ['prod', 'ui', 'customer']
    },
    {
      accountIdentifier: 'testAcc',
      orgIdentifier: 'testOrg',
      identifier: 'Project_1',
      name: 'Project 1',
      color: '#e6b800',
      modules: [],
      description: '',
      owners: ['testAcc'],
      tags: []
    },
    {
      accountIdentifier: 'testAcc',
      orgIdentifier: 'testOrg',
      identifier: 'Project_Demo',
      name: 'Project Demo',
      color: '#004fc4',
      modules: [],
      description: 'Demo project',
      owners: ['testAcc'],
      tags: ['demo', 'temporary']
    },
    {
      accountIdentifier: 'testAcc',
      orgIdentifier: 'testOrg',
      identifier: 'Drone_Data_Supplier',
      name: 'Drone Data Supplier',
      color: '#e67a00',
      modules: ['CD'],
      description: 'Drone',
      owners: ['testAcc'],
      tags: ['prod', 'master']
    },
    {
      accountIdentifier: 'testAcc',
      orgIdentifier: 'testOrg',
      identifier: 'Swagger',
      name: 'Swagger',
      color: '#e6b800',
      modules: [],
      description: 'Swagger 2.0',
      owners: ['testAcc'],
      tags: ['ui', 'backend']
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
