import React from 'react'

import { render, queryByText } from '@testing-library/react'
import i18n from '../CreateConnectorWizard.i18n'
import { CreateConnectorWizard } from '../CreateConnectorWizard'

describe('Delegate Step Wizard', () => {
  test('should render Delegate Setup Wizard', () => {
    const { container } = render(<CreateConnectorWizard accountId={'accountId'} />)
    expect(queryByText(container, i18n.DELEGATE_IN_CLUSTER)).toBeDefined()
    expect(queryByText(container, i18n.DELEGATE_OUT_CLUSTER)).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
