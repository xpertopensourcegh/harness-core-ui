import React from 'react'
import { render, waitFor, queryByText, fireEvent } from '@testing-library/react'
import { noop } from 'lodash-es'
import { Classes } from '@blueprintjs/core'
import { TestWrapper } from '@common/utils/testUtils'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import routes from '@common/RouteDefinitions'
import { SelectProduct } from '../SelectProduct'

describe('SelectProduct', () => {
  test('Render for AppD monitoring source', async () => {
    const { container, getByText } = render(
      <TestWrapper
        path={routes.toCVMainDashBoardPage({ ...accountPathProps, ...projectPathProps })}
        pathParams={{
          accountId: '1234_account',
          projectIdentifier: '1234_project',
          orgIdentifier: '1234_ORG'
        }}
      >
        <SelectProduct type="AppDynamics" onCompleteStep={() => noop} />
      </TestWrapper>
    )
    await waitFor(() => queryByText(container, 'Monitoring Source Type'))
    expect(getByText('AppDynamics')).toBeDefined()
    expect(getByText('+ New AppDynamics Connector')).toBeDefined()
    expect(container).toMatchSnapshot()
  })

  test('Render google cloud operations monitoring source', async () => {
    const { container, getByText } = render(
      <TestWrapper
        path={routes.toCVMainDashBoardPage({ ...accountPathProps, ...projectPathProps })}
        pathParams={{
          accountId: '1234_account',
          projectIdentifier: '1234_project',
          orgIdentifier: '1234_ORG'
        }}
      >
        <SelectProduct
          type="GoogleCloudOperations"
          onCompleteStep={() => noop}
          productSelectValidationText="Product is required."
        />
      </TestWrapper>
    )

    await waitFor(() => expect(queryByText(container, 'Monitoring Source Type')).not.toBeNull())
    fireEvent.click(getByText('+ New Google Cloud Platform Connector'))
    await waitFor(() => expect(document.body.querySelector('[class*="StepWizard"]')).not.toBeNull())

    const closeModalButton = document.querySelector('svg[data-icon="cross"]')
    if (!closeModalButton) {
      throw Error('modal close button did not render')
    }
    fireEvent.click(closeModalButton)
    await waitFor(() => expect(document.body.querySelector('[class*="StepWizard"]')).toBeNull())

    fireEvent.click(getByText('Next'))
    await waitFor(() => expect(container.querySelectorAll(`[class*="${Classes.FORM_HELPER_TEXT}"]`).length).toBe(3))
    getByText('Name is required.')
    getByText('Connector Selection is required.')
    getByText('Product is required.')
  })
})
