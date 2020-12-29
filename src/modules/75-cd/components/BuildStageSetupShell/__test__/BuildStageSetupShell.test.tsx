import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import type { UseGetReturnData } from '@common/utils/testUtils'
import type { ResponseConnectorResponse } from 'services/cd-ng'
import BuildStageSetupShell from '../BuildStageSetupShell'

export const ConnectorResponse: UseGetReturnData<ResponseConnectorResponse> = {
  loading: false,
  refetch: jest.fn(),
  error: null,
  data: {
    status: 'SUCCESS',
    data: {
      connector: {
        name: 'tesa 1',
        identifier: 'tesa_1',
        description: '',
        orgIdentifier: 'Harness11',
        tags: {},
        type: 'K8sCluster',
        spec: {
          credential: {
            type: 'ManualConfig',
            spec: {
              masterUrl: 'asd',
              auth: { type: 'UsernamePassword', spec: { username: 'asd', passwordRef: 'account.test1111' } }
            }
          }
        }
      },
      createdAt: 1602062958274,
      lastModifiedAt: 1602062958274
    },
    correlationId: 'e1841cfc-9ed5-4f7c-a87b-c9be1eeaae34'
  }
}

const secretMockdata = {
  status: 'SUCCESS',
  data: {
    totalPages: 1,
    totalItems: 28,
    pageItemCount: 28,
    pageSize: 100,
    content: [
      {
        secret: {
          type: 'SecretText',
          name: 'testpass',
          identifier: 'testpass',
          tags: {},
          description: '',
          spec: { secretManagerIdentifier: 'harnessSecretManager', valueType: 'Inline', value: null }
        },
        createdAt: 1606900988388,
        updatedAt: 1606900988388,
        draft: false
      }
    ],
    pageIndex: 0,
    empty: false
  },
  metaData: null,
  correlationId: '7f453609-2037-4539-8571-cd3f270e00e9'
}

jest.mock('services/cd-ng', () => ({
  useGetConnector: jest.fn(() => ConnectorResponse),
  getConnectorListPromise: () =>
    Promise.resolve({
      data: {
        content: [
          {
            connector: ConnectorResponse.data!.data!.connector
          }
        ]
      }
    }),
  listSecretsV2Promise: jest.fn().mockImplementation(() => Promise.resolve(secretMockdata))
}))

describe('BuildStageSetupShell snapshot test', () => {
  test('initializes ok', async () => {
    const { container } = render(
      <TestWrapper pathParams={{ accountId: 'dummy', orgIdentifier: 'dummy', projectIdentifier: 'dummy' }}>
        <BuildStageSetupShell />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
