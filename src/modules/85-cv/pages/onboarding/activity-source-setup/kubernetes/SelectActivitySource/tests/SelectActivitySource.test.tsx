import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { Classes } from '@blueprintjs/core'
import { TestWrapper } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import i18n from '../SelectActivitySource.i18n'
import { SelectActivitySource } from '../SelectActivitySource'

describe('Unit tests for SelectActivitySource', () => {
  test('Ensure required fields are validated', async () => {
    const { container, getByText } = render(
      <TestWrapper
        path={routes.toCVProjectOverview({ ...accountPathProps, ...projectPathProps })}
        pathParams={{
          accountId: 'loading',
          projectIdentifier: '1234_project',
          orgIdentifier: '1234_ORG'
        }}
      >
        <SelectActivitySource />
      </TestWrapper>
    )
    await waitFor(() => expect(container.querySelector('[class*="main"]')))
    expect(getByText(i18n.productSelectionCategory.directConnection)).not.toBeNull()

    const kubernetesDirectConnection = container.querySelector('[class*="bp3-card"]')
    if (!kubernetesDirectConnection) {
      throw Error('Direct connection option was not renderd.')
    }

    expect(container.querySelector('[class*="cardIconSelected"]')).not.toBeNull()
    fireEvent.click(kubernetesDirectConnection)
    await waitFor(() => expect(container.querySelector('[class*="cardIconSelected"]')).toBeNull())

    const submitButton = container.querySelector('button[type="submit"]')
    if (!submitButton) throw Error('Submit button was not rendered.')

    fireEvent.click(submitButton)
    await waitFor(() => expect(container.querySelector(`[class*="${Classes.FORM_HELPER_TEXT}"]`)).not.toBeNull())
    for (const validationString of Object.values(i18n.validationStrings)) {
      expect(getByText(validationString)).not.toBeNull()
    }
  })
})
