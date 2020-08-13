import React from 'react'

import { render, queryByText } from '@testing-library/react'
import i18n from '../CreateConnectorWizard.i18n'
import { CreateConnectorWizard } from '../CreateConnectorWizard'

const props = {
  accountId: 'accountId',
  orgIdentifier: 'orgId',
  projectIdentifier: 'projectId',
  type: 'K8sCluster',
  hideLightModal: jest.fn()
}

describe('Delegate Step Wizard', () => {
  test('should render Delegate Setup Wizard', () => {
    const { container } = render(<CreateConnectorWizard {...props} />)
    expect(queryByText(container, i18n.DELEGATE_IN_CLUSTER)).toBeDefined()
    expect(queryByText(container, i18n.DELEGATE_OUT_CLUSTER)).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
