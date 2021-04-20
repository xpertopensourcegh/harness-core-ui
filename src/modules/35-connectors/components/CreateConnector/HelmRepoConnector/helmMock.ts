import type { ConnectorInfoDTO, ResponseBoolean } from 'services/cd-ng'

export const dockerMock: ConnectorInfoDTO = {
  name: 'helmConnector',
  description: 'devConnector description',
  identifier: 'devConnector',
  orgIdentifier: '',
  projectIdentifier: '',
  tags: {},
  type: 'HttpHelmRepo',
  spec: {
    delegateSelectors: [],
    helmRepoUrl: 'https://index.docker.io/v2/',
    auth: { type: 'Anonymous' }
  }
}

export const backButtonMock: ConnectorInfoDTO = {
  name: 'helm http connector',
  description: 'dummy docker description',
  identifier: 'dummyDockerIdentifier',
  orgIdentifier: '',
  projectIdentifier: '',
  tags: {},
  type: 'HttpHelmRepo',
  spec: {
    helmRepoUrl: 'https://index.docker.io/v2/',
    auth: { type: 'UsernamePassword', spec: { username: 'dev', passwordRef: 'account.b13' } }
  }
}

export const mockSecret = {
  status: 'SUCCESS',
  data: {
    secret: {
      type: 'SecretText',
      name: 'b13',
      identifier: 'b13',
      tags: {},
      description: '',
      spec: { secretManagerIdentifier: 'harnessSecretManager', valueType: 'Inline', value: null }
    },
    createdAt: 1604742762283,
    updatedAt: 1604742762283,
    draft: false
  },
  metaData: null,
  correlationId: '435ce32f-4c80-4822-b01a-086186780958'
}

export const mockResponse: ResponseBoolean = {
  status: 'SUCCESS',
  data: true,
  metaData: {},
  correlationId: ''
}
