import React from 'react'
import { render, waitFor, queryByText, fireEvent } from '@testing-library/react'
import { noop } from 'lodash-es'
import { Classes } from '@blueprintjs/core'
import { Formik } from '@wings-software/uicore'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import { CurrentLocation, TestWrapper } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import { SelectProduct } from '../SelectProduct'

function ComponentWrapper(): React.ReactElement {
  return (
    <React.Fragment>
      <SelectProduct
        type="GoogleCloudOperations"
        onCompleteStep={() => noop}
        productSelectValidationText="Product is required."
      />
      <CurrentLocation />
    </React.Fragment>
  )
}

describe('SelectProduct', () => {
  test('Render for AppD monitoring source', async () => {
    const { container, getByText } = render(
      <TestWrapper
        path={routes.toCVProjectOverview({ ...accountPathProps, ...projectPathProps })}
        pathParams={{
          accountId: '1234_account',
          projectIdentifier: '1234_project',
          orgIdentifier: '1234_ORG'
        }}
      >
        <SelectProduct type="AppDynamics" onCompleteStep={() => noop} />
      </TestWrapper>
    )
    await waitFor(() => queryByText(container, 'monitoringSource'))
    expect(getByText('AppDynamics')).toBeDefined()
    expect(getByText('cv.monitoringSources.appD.createConnectorText')).toBeDefined()
    expect(container).toMatchSnapshot()
  })

  test('Render google cloud operations monitoring source', async () => {
    const { container, getByText } = render(
      <TestWrapper
        path={routes.toCVProjectOverview({ ...accountPathProps, ...projectPathProps })}
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

    await waitFor(() => expect(queryByText(container, 'monitoringSource')).not.toBeNull())
    fireEvent.click(getByText('cv.monitoringSources.gco.createConnectorText'))
    await waitFor(() => expect(document.body.querySelector('[class*="StepWizard"]')).not.toBeNull())

    const closeModalButton = document.querySelector('svg[data-icon="cross"]')
    if (!closeModalButton) {
      throw Error('modal close button did not render')
    }
    fireEvent.click(closeModalButton)
    await waitFor(() => expect(document.body.querySelector('[class*="StepWizard"]')).toBeNull())

    fireEvent.click(getByText('next'))
    await waitFor(() => expect(container.querySelectorAll(`[class*="${Classes.FORM_HELPER_TEXT}"]`).length).toBe(2))
    getByText('cv.onboarding.selectProductScreen.validationText.connectorRef')
    getByText('Product is required.')
  })

  test('Ensure that Cloud Metrics is disabled when Cloud Logs is selected in Edit mode', async () => {
    const stepData = {
      accountId: 'zEaak-FLS425IEO7OLzMUg',
      orgIdentifier: 'Testing',
      projectIdentifier: 'Harshiltest',
      monitoringSource: 'google-cloud-operations',
      identifier: 'MyGoogleCloudOperationsSource',
      product: 'Cloud Logs',
      name: 'MyGoogleCloudOperationsSource',
      selectedDashboards: [],
      selectedMetrics: {},
      type: 'STACKDRIVER_LOG',
      mappedServicesAndEnvs: {},
      isEdit: true,
      connectorRef: null
    }
    const { getByText } = render(
      <TestWrapper
        path="/account/:accountId/project/:projectIdentifier/orgIdentifier/:orgIdentifier/monitoringSource/:monitoringSource/identifier/:identifier"
        pathParams={{
          accountId: '1234_account',
          projectIdentifier: '1234_project',
          orgIdentifier: '1234_ORG',
          monitoringSource: stepData.monitoringSource,
          identifier: stepData.identifier
        }}
      >
        <Formik initialValues={{ ...stepData }} onSubmit={jest.fn()} formName="wrapperComponentTestForm">
          <SelectProduct type="GoogleCloudOperations" onCompleteStep={() => noop} stepData={stepData} />
        </Formik>
      </TestWrapper>
    )

    const cloudLogsCard = await waitFor(() => getByText('cv.monitoringSources.gco.product.logs'))
    const cloudMetricsCard = await waitFor(() => getByText('cv.monitoringSources.gco.product.metrics'))

    expect(cloudMetricsCard?.closest('div')?.classList.contains('Card--disabled')).toBe(true)
    expect(cloudLogsCard?.closest('div')?.classList.contains('Card--disabled')).toBe(false)
  })

  test('Ensure that Cloud Logs is disabled when Cloud Metrics is selected in Edit mode', async () => {
    const stepData = {
      accountId: 'zEaak-FLS425IEO7OLzMUg',
      orgIdentifier: 'Testing',
      projectIdentifier: 'Harshiltest',
      monitoringSource: 'google-cloud-operations',
      identifier: 'MyGoogleCloudOperationsSource',
      product: 'Cloud Metrics',
      name: 'MyGoogleCloudOperationsSource',
      selectedDashboards: [],
      selectedMetrics: {},
      type: 'STACKDRIVER',
      mappedServicesAndEnvs: {},
      isEdit: true,
      connectorRef: null
    }
    const { getByText } = render(
      <TestWrapper
        path="/account/:accountId/project/:projectIdentifier/orgIdentifier/:orgIdentifier/monitoringSource/:monitoringSource/identifier/:identifier"
        pathParams={{
          accountId: '1234_account',
          projectIdentifier: '1234_project',
          orgIdentifier: '1234_ORG',
          monitoringSource: stepData.monitoringSource,
          identifier: stepData.identifier
        }}
      >
        <Formik initialValues={{ ...stepData }} onSubmit={jest.fn()} formName="wrapperComponentTestForm">
          <SelectProduct type="GoogleCloudOperations" onCompleteStep={() => noop} stepData={stepData} />
        </Formik>
      </TestWrapper>
    )

    const cloudLogsCard = await waitFor(() => getByText('cv.monitoringSources.gco.product.logs'))
    const cloudMetricsCard = await waitFor(() => getByText('cv.monitoringSources.gco.product.metrics'))

    expect(cloudMetricsCard?.closest('div')?.classList.contains('Card--disabled')).toBe(false)
    expect(cloudLogsCard?.closest('div')?.classList.contains('Card--disabled')).toBe(true)
  })

  test('Ensure that when user clicks previous, it takes them back to monitoring source page', async () => {
    const { container, getByText, getByTestId } = render(
      <TestWrapper
        path={routes.toCVProjectOverview({ ...accountPathProps, ...projectPathProps })}
        pathParams={{
          accountId: '1234_account',
          projectIdentifier: '1234_project',
          orgIdentifier: '1234_ORG'
        }}
      >
        <ComponentWrapper />
      </TestWrapper>
    )

    await waitFor(() => expect(queryByText(container, 'monitoringSource')).not.toBeNull())
    fireEvent.click(getByText('previous'))

    expect(getByTestId('location')).toMatchInlineSnapshot(`
      <div
        data-testid="location"
      >
        /account/1234_account/cv/orgs/1234_ORG/projects/1234_project/admin/setup?step=2
      </div>
    `)
  })
})
