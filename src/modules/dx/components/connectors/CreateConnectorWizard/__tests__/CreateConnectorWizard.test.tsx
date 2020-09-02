import React from 'react'
import { MemoryRouter } from 'react-router'

import { render, queryByText } from '@testing-library/react'
import type { ConnectorDTO } from 'services/cd-ng'
import { CreateConnectorWizard } from '../CreateConnectorWizard'

import i18n from '../CreateConnectorWizard.i18n'

const props = {
  accountId: 'accountId',
  orgIdentifier: 'orgId',
  projectIdentifier: 'projectId',
  type: 'K8sCluster' as ConnectorDTO['type'],
  hideLightModal: jest.fn(),
  onSuccess: jest.fn()
}

describe('Delegate Step Wizard', () => {
  test('should render Delegate Setup Wizard', () => {
    const { container } = render(
      <MemoryRouter>
        <CreateConnectorWizard {...props} />
      </MemoryRouter>
    )
    expect(queryByText(container, i18n.DELEGATE_IN_CLUSTER)).toBeDefined()
    expect(queryByText(container, i18n.DELEGATE_OUT_CLUSTER)).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
