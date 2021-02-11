import React from 'react'
import { noop } from 'lodash-es'
import { render, fireEvent, queryByText } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { TestWrapper } from '@common/utils/testUtils'
import { mockResponse, mockSecret, mockConnector } from './mock'
import CreateAWSConnector from '../CreateAWSConnector'
import { backButtonTest } from '../../commonTest'

const commonProps = {
  accountId: 'dummy',
  orgIdentifier: '',
  projectIdentifier: '',
  setIsEditMode: noop,
  onClose: noop,
  onSuccess: noop
}

const createConnector = jest.fn()
const updateConnector = jest.fn()

jest.mock('services/cd-ng', () => ({
  validateTheIdentifierIsUniquePromise: jest.fn().mockImplementation(() => Promise.resolve(mockResponse)),
  useCreateConnector: jest.fn().mockImplementation(() => ({ mutate: createConnector })),
  useUpdateConnector: jest.fn().mockImplementation(() => ({ mutate: updateConnector })),
  getSecretV2Promise: jest.fn().mockImplementation(() => Promise.resolve(mockSecret))
}))

describe('Create AWS connector Wizard', () => {
  test('Should render form', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateAWSConnector {...commonProps} isEditMode={false} connectorInfo={undefined} />
      </TestWrapper>
    )

    // fill step 1
    await act(async () => {
      fireEvent.change(container.querySelector('input[name="name"]')!, {
        target: { value: 'dummy name' }
      })
    })
    // match step 1
    expect(container).toMatchSnapshot()

    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })

    // match step 2
    expect(container).toMatchSnapshot()
  })
  test('Should render form for edit ', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateAWSConnector
          {...commonProps}
          isEditMode={true}
          connectorInfo={mockConnector.data.connector as any}
          mock={mockResponse}
        />
      </TestWrapper>
    )
    // editing connector name
    await act(async () => {
      fireEvent.change(container.querySelector('input[name="name"]')!, {
        target: { value: 'dummy name' }
      })
    })
    expect(container).toMatchSnapshot()
    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })
    // step 2
    expect(queryByText(container, 'AWS Access Key')).toBeDefined()
    expect(container).toMatchSnapshot()

    //updating connector
    await act(async () => {
      fireEvent.click(container.querySelector('button[type="submit"]')!)
    })

    expect(updateConnector).toBeCalledWith({
      connector: {
        description: mockConnector.data.connector.description,
        identifier: 'AWS_test',
        name: 'dummy name',
        orgIdentifier: undefined,
        projectIdentifier: undefined,
        spec: {
          credential: {
            crossAccountAccess: {
              crossAccountRoleArn: 'mock URN',
              externalId: 'externalId'
            },
            spec: {
              accessKey: 'mockAccessKey',
              secretKeyRef: 'account.mnfbjfjsecretKey'
            },
            type: 'ManualConfig'
          }
        },
        tags: {},
        type: 'Aws'
      }
    })
  })

  backButtonTest({
    Element: (
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateAWSConnector
          {...commonProps}
          isEditMode={true}
          connectorInfo={mockConnector.data.connector as any}
          mock={mockResponse}
        />
      </TestWrapper>
    ),
    backButtonSelector: '[data-name="awsBackButton"]',
    mock: mockConnector.data.connector as any
  })
})
