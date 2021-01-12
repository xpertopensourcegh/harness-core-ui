import React from 'react'

import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { Connectors } from '@connectors/constants'
import { CreateConnectorWizard } from '../CreateConnectorWizard'

const commonProps = {
  accountId: 'accountId',
  orgIdentifier: 'orgId',
  projectIdentifier: 'projectId',
  connectorInfo: undefined,
  isEditMode: false,
  hideLightModal: jest.fn(),
  onSuccess: jest.fn(),
  setIsEditMode: jest.fn()
}

describe('Create connector Wizard', () => {
  test('should open CreateConnectorWizard for k8', () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateConnectorWizard type={Connectors.KUBERNETES_CLUSTER} {...commonProps} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('should open CreateConnectorWizard for Github', () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateConnectorWizard type={Connectors.GITHUB} {...commonProps} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('should open CreateConnectorWizard for Gitlab', () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateConnectorWizard type={Connectors.GITLAB} {...commonProps} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('should open CreateConnectorWizard for BITBUCKET', () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateConnectorWizard type={Connectors.BITBUCKET} {...commonProps} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('should open CreateConnectorWizard for VAULT', () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateConnectorWizard type={Connectors.VAULT} {...commonProps} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('should open CreateConnectorWizard for DOCKER', () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateConnectorWizard type={Connectors.DOCKER} {...commonProps} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('should open CreateConnectorWizard for GCP', () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateConnectorWizard type={Connectors.GCP} {...commonProps} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
