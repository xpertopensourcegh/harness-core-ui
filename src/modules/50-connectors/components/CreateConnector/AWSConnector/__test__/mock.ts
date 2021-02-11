import type { ResponseBoolean } from 'services/cd-ng'

export const mockConnector = {
  status: 'SUCCESS',
  data: {
    connector: {
      name: 'AWS test',
      identifier: 'AWS_test',
      description: 'dummy AWS description',
      orgIdentifier: null,
      projectIdentifier: null,
      tags: {},
      type: 'Aws',
      spec: {
        credential: {
          crossAccountAccess: { crossAccountRoleArn: 'mock URN', externalId: 'externalId' },
          type: 'ManualConfig',
          spec: { accessKey: 'mockAccessKey', secretKeyRef: 'account.mnfbjfjsecretKey' }
        }
      }
    },
    createdAt: 1610964845475,
    lastModifiedAt: 1610964845451,
    status: null,
    harnessManaged: false
  },
  metaData: null,
  correlationId: '0b7963ac-ae8c-40fa-9af8-dce37bbfdd6e'
}

export const mockSecret = {
  status: 'SUCCESS',
  data: {
    secret: {
      type: 'SecretText',
      name: 'connectorPass',
      identifier: 'connectorPass',
      tags: {},
      description: '',
      spec: { secretManagerIdentifier: 'harnessSecretManager' }
    },
    createdAt: 1606373702954,
    updatedAt: 1606373702954,
    draft: false
  },
  metaData: null,
  correlationId: '0346aa2b-290e-4892-a7f0-4ad2128c9829'
}

export const mockResponse: ResponseBoolean = {
  status: 'SUCCESS',
  data: true,
  metaData: {},
  correlationId: ''
}
