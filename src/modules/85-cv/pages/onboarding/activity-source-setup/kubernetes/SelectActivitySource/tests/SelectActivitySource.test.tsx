import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { Classes } from '@blueprintjs/core'
import * as framework from 'framework/route/RouteMounter'
import { SelectActivitySource } from '../SelectActivitySource'
import i18n from '../SelectActivitySource.i18n'

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
  test('Ensure required fields are validated', async () => {
    const { container, getByText } = render(<SelectActivitySource />)
    await waitFor(() => expect(container.querySelector('[class*="main"]')))
    expect(getByText(i18n.productSelectionCategory.directConnection)).not.toBeNull()

    const submitButton = container.querySelector('button[type="submit"]')
    if (!submitButton) throw Error('Submit button was not rendered.')

    fireEvent.click(submitButton)
    await waitFor(() => expect(container.querySelector(`[class*="${Classes.FORM_HELPER_TEXT}"]`)).not.toBeNull())
    for (const validationString of Object.values(i18n.validationStrings)) {
      expect(getByText(validationString)).not.toBeNull()
    }
  })
})
