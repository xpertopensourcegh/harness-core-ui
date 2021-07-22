import React from 'react'
import { render } from '@testing-library/react'
import { Container, Button } from '@wings-software/uicore'
import routes from '@common/RouteDefinitions'
import { TestWrapper, TestWrapperProps } from '@common/utils/testUtils'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import * as cvServices from 'services/cv'
import { InputTypes, setFieldValue } from '@common/utils/JestFormHelper'
import MonitoredService from '../MonitoredService'

const testWrapperProps: TestWrapperProps = {
  path: routes.toCVAddMonitoringServicesSetup({ ...accountPathProps, ...projectPathProps }),
  pathParams: {
    accountId: '1234_accountId',
    projectIdentifier: '1234_project',
    orgIdentifier: '1234_org'
  }
}

jest.mock('@cv/components/HarnessServiceAndEnvironment/HarnessServiceAndEnvironment', () => ({
  useGetHarnessServices: () => ({
    serviceOptions: [
      { label: 'service1', value: 'service1' },
      { label: 'AppDService101', value: 'AppDService101' }
    ]
  }),
  HarnessServiceAsFormField: function MockComponent(props: any) {
    return (
      <Container>
        <Button
          className="addService"
          onClick={() => props.serviceProps.onNewCreated({ name: 'newService', identifier: 'newService' })}
        />
      </Container>
    )
  },
  HarnessEnvironmentAsFormField: function MockComponent(props: any) {
    return (
      <Container>
        <Button
          className="addEnv"
          onClick={() => props.environmentProps.onNewCreated({ name: 'newEnv', identifier: 'newEnv' })}
        />
      </Container>
    )
  },
  useGetHarnessEnvironments: () => {
    return {
      environmentOptions: [
        { label: 'env1', value: 'env1' },
        { label: 'AppDTestEnv1', value: 'AppDTestEnv1' }
      ]
    }
  }
}))

describe('Unit tests for createting monitored source', () => {
  beforeAll(() => {
    jest.spyOn(cvServices, 'useGetMonitoredService').mockImplementation(
      () =>
        ({
          data: {}
        } as any)
    )
  })
  test('Health source tabel and environment services compoenet renders', async () => {
    const { container, getByText } = render(
      <TestWrapper {...testWrapperProps}>
        <MonitoredService />
      </TestWrapper>
    )

    // Servie and environment
    expect(getByText('cv.monitoredServices.serviceAndEnvironment')).toBeDefined()

    // Table cv.healthSource.defineYourSource
    expect(getByText('cv.healthSource.defineYourSource')).toBeDefined()

    expect(container).toMatchSnapshot()
  })

  test('Health source table and environment services compoenet renders', async () => {
    const { container, getByText } = render(
      <TestWrapper {...testWrapperProps}>
        <MonitoredService />
      </TestWrapper>
    )

    await setFieldValue({
      container,
      type: InputTypes.TEXTFIELD,
      fieldId: 'name',
      value: 'Updated Monitored service'
    })
    // determine identifier is updated
    expect(getByText('Updated_Monitored_service')).toBeDefined()
    // value is refelecting in input
    expect(container.querySelector('input[value="Updated Monitored service"]')).toBeDefined()
    // TODO check a way to update service and environment
    expect(container.querySelector('input[placeholder="Select or create a service"]')).toBeDefined()
    expect(container.querySelector('input[placeholder="Select or create a environment"]')).toBeDefined()

    expect(container).toMatchSnapshot()
  })
})
