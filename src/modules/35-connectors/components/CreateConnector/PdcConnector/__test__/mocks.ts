/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import type { ConnectorInfoDTO, ResponseBoolean } from 'services/cd-ng'

export const encryptedKeyMock: ConnectorInfoDTO = {
  name: 'devConnector',
  identifier: 'devConnector',
  description: 'devConnector description',
  orgIdentifier: undefined,
  projectIdentifier: undefined,
  tags: {},
  type: 'Pdc',
  spec: {
    delegateSelectors: ['dummyDelegateSelector'],
    hosts: ''
  }
}

export const mockSecret = {
  status: 'SUCCESS',
  data: {
    secret: {
      type: 'SecretFile',
      name: 's15656',
      identifier: 's15656',
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

export const backButtonMock: ConnectorInfoDTO = {
  name: 'dummy pdc connector',
  identifier: 'dummyPDCIdentifier',
  description: 'dummy pdc description',
  orgIdentifier: '',
  projectIdentifier: '',
  tags: {},
  type: 'Pdc',
  spec: {
    hosts: ''
  }
}