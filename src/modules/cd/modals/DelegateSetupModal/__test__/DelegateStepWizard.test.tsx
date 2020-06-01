import React from 'react'

import { render, fireEvent, queryByText, waitFor } from '@testing-library/react'
import i18n from '../DelegateSetup.i18n'
import { DelegateStepWizard } from '../DelegateStepWizard'

describe('Delegate Step Wizard', () => {
  test('should render Delegate Setup Wizard', () => {
    const { container } = render(<DelegateStepWizard />)
    expect(queryByText(container, i18n.DELEGATE_IN_CLUSTER)).toBeDefined()
    expect(queryByText(container, i18n.DELEGATE_OUT_CLUSTER)).toBeDefined()
    expect(container).toMatchSnapshot()
  })
  test('should be able to install in cluster delegate', async () => {
    const { container } = render(<DelegateStepWizard />)
    fireEvent.click(queryByText(container, i18n.DELEGATE_IN_CLUSTER) as HTMLElement)
    await waitFor(() => {
      expect(queryByText(container, i18n.STEP_TWO.CONNECTOR_NAME_LABEL)).toBeDefined()
      expect(queryByText(container, i18n.STEP_TWO.CONNECTOR_NAME_PLACEHOLDER)).toBeDefined()
    })

    fireEvent.click(queryByText(container, /Save and Continue/) as HTMLElement)
    await waitFor(() => {
      expect(container).toMatchSnapshot()
    })
  })
})
