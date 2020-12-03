import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { Formik, FormikForm } from '@wings-software/uikit'
import type { UseGetReturn } from 'restful-react'
import routes from '@common/RouteDefinitions'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import { TestWrapper } from '@common/utils/testUtils'
import * as cdService from 'services/cd-ng'
import {
  SelectOrCreateConnector,
  SelectOrCreateConnectorFieldNames,
  SelectOrCreateConnectorProps
} from '../SelectOrCreateConnector'

function WrapperComponent(props: SelectOrCreateConnectorProps): JSX.Element {
  return (
    <TestWrapper
      path={routes.toCVMainDashBoardPage({ ...accountPathProps, ...projectPathProps })}
      pathParams={{
        accountId: '1234_accountId',
        projectIdentifier: '1234_project',
        orgIdentifier: '1234_ORG'
      }}
    >
      <Formik initialValues={{}} onSubmit={() => undefined}>
        {formikProps => (
          <FormikForm className="wrapperForm">
            <SelectOrCreateConnector
              {...props}
              onSuccess={data =>
                formikProps.setFieldValue(SelectOrCreateConnectorFieldNames.CONNECTOR_REF, {
                  label: data?.connector?.name,
                  value: data?.connector?.identifier
                })
              }
            />
          </FormikForm>
        )}
      </Formik>
    </TestWrapper>
  )
}

describe('Unit tests for SelectorCreateConnector', () => {
  test('Ensure that when a value is provided, fetch connector api is only called once', async () => {
    const refetchMock = jest.fn()
    const useGetConnectorSpy = jest.spyOn(cdService, 'useGetConnector')
    useGetConnectorSpy.mockReturnValue({
      loading: false,
      refetch: refetchMock as any,
      data: { data: { connector: { name: 'solo', identifier: 'solo' } } }
    } as UseGetReturn<any, any, any, any>)
    const onSuccessMockFn = jest.fn()
    const { container, getByText } = render(
      <WrapperComponent
        connectorType="K8sCluster"
        value={{ label: 'solo', value: 'solo' }}
        iconName="service-kubernetes"
        iconLabel="sdosds"
        createConnectorText="something"
        connectToMonitoringSourceText="solo-dolo"
        firstTimeSetupText="+ something"
        onSuccess={onSuccessMockFn}
      />
    )

    await waitFor(() => expect(container.querySelector('[class*="wrapperForm"]')).not.toBeNull())
    await waitFor(() => expect(refetchMock).toHaveBeenCalledTimes(1))
    expect(getByText('solo')).not.toBeNull()
  })

  test('Ensure that when api is loading, loading state is rendered', async () => {
    const refetchMock = jest.fn()
    const useGetConnectorSpy = jest.spyOn(cdService, 'useGetConnector')
    useGetConnectorSpy.mockReturnValue({
      loading: true,
      refetch: refetchMock as any
    } as UseGetReturn<any, any, any, any>)
    const onSuccessMockFn = jest.fn()
    const { container } = render(
      <WrapperComponent
        connectorType="K8sCluster"
        value={{ label: 'solo', value: 'solo' }}
        iconName="service-kubernetes"
        iconLabel="sdosds"
        createConnectorText="something"
        connectToMonitoringSourceText="solo-dolo"
        firstTimeSetupText="+ something"
        onSuccess={onSuccessMockFn}
      />
    )

    await waitFor(() => expect(container.querySelector('[class*="wrapperForm"]')).not.toBeNull())
    expect(container.querySelector('input[value="Loading..."]')).not.toBeNull()
  })
})
