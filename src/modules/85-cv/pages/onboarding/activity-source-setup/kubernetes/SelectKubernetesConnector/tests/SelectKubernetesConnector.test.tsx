import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { Container } from '@wings-software/uikit'
import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'
import { SelectKubernetesConnector, SelectKubernetesConnectorProps } from '../SelectKubernetesConnector'
import i18n from '../SelectKubernetesConnector.i18n'

function WrapperComponent(props: SelectKubernetesConnectorProps): JSX.Element {
  return (
    <Container>
      <SelectKubernetesConnector {...props} />
      <SubmitAndPreviousButtons />
    </Container>
  )
}

describe('Unit tests for SelectKubernetesConnector', () => {
  test('Ensure required fields are validated', async () => {
    const { container, getByText } = render(<WrapperComponent />)
    await waitFor(() => expect(container.querySelector('[class*="main"]')))
    expect(container.querySelector('#onBoardingForm')).not.toBeNull()
    expect(getByText(i18n.productSelectionCategory.directConnection)).not.toBeNull()

    const submitButton = container.querySelector('button[type="submit"]')
    if (!submitButton) throw Error('Submit button was not rendered.')

    fireEvent.click(submitButton)
    await waitFor(() => expect(getByText(i18n.validationStrings.infraType)))
    await waitFor(() => expect(getByText(i18n.validationStrings.nameActivitySource)))
  })
})
