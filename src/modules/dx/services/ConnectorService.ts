import xhr from '@wings-software/xhr-async'
// import type { ServiceResponse } from 'modules/common/services/ServiceResponse'

interface CreateConnector {
  xhrGroup: string
  connector: any
}

export function createConnector({ xhrGroup, connector }: CreateConnector) {
  const url = `http://localhost:7457/connectors`
  return xhr.post(url, { xhrGroup, data: connector }).as('connector')
}

export function getConnector({ connectorId }: any) {
  const url = `http://localhost:7457/connectors?connectorIdentifier=${connectorId}`
  return xhr.get(url).as('connector')
  // return {
  //   name: 'My k8s Cluster',
  //   identifier: 'connector2',
  //   accountIdentifier: 'Test-account',
  //   orgIdentifier: 'Devops',
  //   projectIdentifer: 'Harness Sample App',
  //   kind: 'K8sCluster',
  //   spec: {
  //     kind: 'ManualConfig',
  //     spec: {
  //       masterUrl: 'http://github.com',
  //       auth: {
  //         kind: 'UserPassWord',
  //         spec: {
  //           useranme: 'username',
  //           password: 'password_one',
  //           cacert: ''
  //         }
  //       }
  //     }
  //   }
  // }
}
export function fetchAllConnectors() {
  return [
    {
      identifier: 'connector1',
      name: 'name1',
      accountName: 'account-1',
      orgName: 'org-1',
      projectName: 'project-1',
      scope: 'PROJECT',
      type: 'K8sCluster',
      categories: ['CLOUD-PROVIDER'],
      connectorDetails: {
        // One of these two fields will be present
        masterURL: 'url1',
        delegateName: 'delegateName1'
      },
      tags: ['prod', 'qa'],
      createdAt: 1000,
      lastModifiedAt: 1200,
      version: 3
    },
    {
      identifier: 'connector2',
      name: 'My k8s Cluster',
      accountName: 'account-2',
      orgName: 'org-2',
      projectName: 'project-2',
      scope: 'PROJECT',
      type: 'K8sCluster',
      categories: ['CLOUD-PROVIDER'],
      connectorDetails: {
        // One of these two fields will be present
        masterURL: 'http://github.com',
        delegateName: 'delegateName2'
      },
      tags: ['prodtag', 'qa'],
      createdAt: 1000,
      lastModifiedAt: 1200,
      version: 3
    }
  ]
}
