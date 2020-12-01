import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { Container, FormInput } from '@wings-software/uikit'
import { InputTypes, setFieldValue } from '@common/utils/JestFormHelper'
import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'
import { TestWrapper } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import { SelectKubernetesConnector } from '../SelectKubernetesConnector'

jest.mock('@cv/pages/onboarding/SelectOrCreateConnector/SelectOrCreateConnector', () => ({
  ...(jest.requireActual('@cv/pages/onboarding/SelectOrCreateConnector/SelectOrCreateConnector') as object),
  ConnectorSelection: function MockComponent() {
    return <FormInput.Text name="connectorRef" />
  }
}))

describe('Unit tests for SelectActivitySource', () => {
  test('Ensure validation works', async () => {
    const onSubmitMockFunc = jest.fn()
    const { container } = render(
      <TestWrapper
        path={routes.toCVMainDashBoardPage({ ...accountPathProps, ...projectPathProps })}
        pathParams={{
          accountId: 'loading',
          projectIdentifier: '1234_project',
          orgIdentifier: '1234_ORG'
        }}
      >
        <Container>
          <SelectKubernetesConnector onSubmit={onSubmitMockFunc} onPrevious={() => undefined} />
          <SubmitAndPreviousButtons />
        </Container>
      </TestWrapper>
    )

    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())
    const submitButton = container.querySelector('button[type="submit"]')
    if (!submitButton) {
      throw Error('Submit button was not rendered.')
    }

    setFieldValue({ container, type: InputTypes.TEXTFIELD, fieldId: 'connectorRef', value: 'blah' })
    fireEvent.click(submitButton)

    await waitFor(() => expect(onSubmitMockFunc).toHaveBeenCalledWith({ connectorRef: 'blah' }))
  })
})
