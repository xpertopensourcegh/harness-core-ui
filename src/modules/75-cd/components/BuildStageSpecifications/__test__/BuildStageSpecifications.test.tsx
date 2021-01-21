import React from 'react'
import { queryByAttribute, act, fireEvent, findByText, render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import type { SecretDTOV2 } from 'services/cd-ng'
import type { UseGetReturnData } from '@common/utils/testUtils'
import type { ResponseConnectorResponse } from 'services/cd-ng'
import BuildStageSpecifications, { getSecretKey } from '../BuildStageSpecifications'
import mockData from './mockData.json'
jest.mock('@common/components/YAMLBuilder/YamlBuilder', () => ({ children }: { children: JSX.Element }) => (
  <div>{children}</div>
))

export const ConnectorResponse: UseGetReturnData<ResponseConnectorResponse> = {
  loading: false,
  refetch: jest.fn(),
  error: null,
  data: {
    status: 'SUCCESS',
    data: {
      connector: {
        name: 'connectorRef',
        identifier: 'connectorRef',
        description: '',
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

jest.mock('services/cd-ng', () => ({
  listSecretsV2Promise: jest.fn().mockImplementation(() => Promise.resolve(mockData)),
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
  getConnectorListV2Promise: () =>
    Promise.resolve({
      data: {
        content: [
          {
            connector: ConnectorResponse.data!.data!.connector
          }
        ]
      }
    })
}))

const mockSecretDataBase: SecretDTOV2 = {
  type: 'SecretFile',
  name: 'testName',
  spec: {
    errorMessageForInvalidYaml: 'error'
  },
  identifier: 'testId'
}
const mockSecretDataNoOrg = { ...mockSecretDataBase, projectIdentifier: 'testProject' }
const mockSecretDataNoProject = { ...mockSecretDataBase, orgIdentifier: 'testOrg' }

describe('BuildStageSpecifications tests', () => {
  test('renders correctly', async () => {
    const { container } = render(
      <TestWrapper pathParams={{ accountIdentifier: 'dummy' }}>
        <BuildStageSpecifications />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
  test('clicking on description shows corresponding inputs', async () => {
    const { container } = render(
      <TestWrapper pathParams={{ accountIdentifier: 'dummy' }}>
        <BuildStageSpecifications />
      </TestWrapper>
    )
    const addDescriptionBtn = await findByText(container, 'description')
    expect(addDescriptionBtn).toBeDefined()
    await act(async () => {
      fireEvent.click(addDescriptionBtn)
    })
    expect(queryByAttribute('name', container, 'description')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
  // TODO: Uncomment and fix it once have time for this
  // eslint-disable-next-line jest/no-commented-out-tests
  // test('able to add a variable', async () => {
  //   const { container } = render(
  //     <TestWrapper pathParams={{ accountIdentifier: 'dummy' }}>
  //       <BuildStageSpecifications />
  //     </TestWrapper>
  //   )

  //   await act(async () => {
  //     const addVariableBtn = await findByText(container, '+ Add Variable')
  //     expect(addVariableBtn).toBeDefined()
  //     fireEvent.click(addVariableBtn)
  //     const portal = document.getElementsByClassName('bp3-dialog')[0]
  //     // enter variable name and save
  //     const variableNameInput = portal.querySelector("input[name='name']")
  //     expect(variableNameInput).toBeDefined()
  //     fireEvent.change(variableNameInput!, { target: { value: 'dummy-var' } })
  //     expect(variableNameInput).toHaveProperty('value', 'dummy-var')
  //     const saveAndContinueButton = await findByText(portal as HTMLElement, 'Add')
  //     fireEvent.click(saveAndContinueButton as Element)
  //   })

  //   const variableName = await findByText(container, 'dummy-var')
  //   expect(variableName).toBeDefined()
  // })
  test('getSecretKey works correctly', async () => {
    expect(getSecretKey(mockSecretDataBase)).toEqual('account.testId')
    expect(getSecretKey(mockSecretDataNoOrg)).toEqual('project.testId')
    expect(getSecretKey(mockSecretDataNoProject)).toEqual('org.testId')
  })
})
