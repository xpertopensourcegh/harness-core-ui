import type { ConnectorInfoDTO, ResponseBoolean } from 'services/cd-ng'

export const serviceNowMock: ConnectorInfoDTO = {
    name: 'serviceNowConnector',
    description: 'devConnector description',
    identifier: 'devConnector',
    orgIdentifier: '',
    projectIdentifier: '',

    type: 'ServiceNow',
    spec: {
      serviceNowUrl: 'https://serviceNow.dev.harness.io/'
    }
  },
  serviceNowBackButtonMock: ConnectorInfoDTO = {
    name: 'serviceNowConnector',
    description: 'devConnector description',
    identifier: 'devConnector',
    orgIdentifier: '',
    projectIdentifier: '',

    type: 'ServiceNow',
    spec: {
      serviceNowUrl: 'https://serviceNow.dev.harness.io/',
      username: 'harnessadmin',
      passwordRef: 'serviceNow_secret'
    }
  },
  mockServiceNowSecret = {
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
  },
  mockServiceNowResponse: ResponseBoolean = {
    status: 'SUCCESS',
    data: true,
    metaData: {},
    correlationId: ''
  }