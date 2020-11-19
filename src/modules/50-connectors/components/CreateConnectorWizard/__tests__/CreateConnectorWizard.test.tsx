import React from 'react'

import { render } from '@testing-library/react'
import type { ConnectorInfoDTO } from 'services/cd-ng'
import { TestWrapper } from '@common/utils/testUtils'
import { CreateConnectorWizard } from '../CreateConnectorWizard'

const props = {
  accountId: 'accountId',
  orgIdentifier: 'orgId',
  projectIdentifier: 'projectId',
  type: 'K8sCluster' as ConnectorInfoDTO['type'],
  hideLightModal: jest.fn(),
  onSuccess: jest.fn()
}

describe('Create connector Wizard', () => {
  test('should open CreateConnectorWizard', () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <CreateConnectorWizard {...props} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
