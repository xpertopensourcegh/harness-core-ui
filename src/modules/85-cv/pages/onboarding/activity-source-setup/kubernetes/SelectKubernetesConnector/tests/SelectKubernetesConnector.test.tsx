import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { Container, FormInput } from '@wings-software/uikit'
import { InputTypes, setFieldValue } from '@common/utils/JestFormHelper'
import * as framework from 'framework/route/RouteMounter'
import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'
import { SelectKubernetesConnector } from '../SelectKubernetesConnector'

jest.mock('@cv/pages/onboarding/SelectOrCreateConnector/SelectOrCreateConnector', () => ({
  ...(jest.requireActual('@cv/pages/onboarding/SelectOrCreateConnector/SelectOrCreateConnector') as object),
  ConnectorSelection: function MockComponent() {
    return <FormInput.Text name="connectorRef" />
  }
}))

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn().mockReturnValue([])
}))

describe('Unit tests for SelectActivitySource', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const mockRouteParams = jest.spyOn(framework, 'useRouteParams')
    mockRouteParams.mockReturnValue({
      params: {
        accountId: 'loading',
        projectIdentifier: '1234_project',
        orgIdentifier: '1234_ORG'
      },
      query: {}
    })
  })
  test('Ensure validation works', async () => {
    const onSubmitMockFunc = jest.fn()
    const { container } = render(
      <Container>
        <SelectKubernetesConnector onSubmit={onSubmitMockFunc} onPrevious={() => undefined} />
        <SubmitAndPreviousButtons />
      </Container>
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
