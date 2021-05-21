import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { Button, Container } from '@wings-software/uicore'
import { TestWrapper } from '@common/utils/testUtils'
import { MapPrometheusMetricToService } from '../MapPrometheusMetricToService'
import { MapPrometheusQueryToServiceFieldNames } from '../../../constants'

jest.mock('@cv/components/HarnessServiceAndEnvironment/HarnessServiceAndEnvironment', () => ({
  ...(jest.requireActual('@cv/components/HarnessServiceAndEnvironment/HarnessServiceAndEnvironment') as any),
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
  }
}))

describe('Unit tests for MapPrometheusMetricToService', () => {
  test('Ensure that when a new service is created, that service is selected', async () => {
    const onChangeMock = jest.fn()
    const setServiceOptionsMock = jest.fn()
    const { container } = render(
      <TestWrapper>
        <MapPrometheusMetricToService
          onChange={onChangeMock}
          serviceOptions={[]}
          environmentOptions={[]}
          setPrometheusGroupNames={jest.fn()}
          setEnvironmentOptions={jest.fn()}
          setServiceOptions={setServiceOptionsMock}
        />
      </TestWrapper>
    )

    await waitFor(() => expect(container.querySelector('.addService')).not.toBeNull())
    const button = container.querySelector('button.addService')
    if (!button) {
      throw Error('add service button not rendered')
    }
    fireEvent.click(button)
    await waitFor(() => expect(setServiceOptionsMock).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(onChangeMock).toHaveBeenCalledWith(MapPrometheusQueryToServiceFieldNames.SERVICE, {
        label: 'newService',
        value: 'newService'
      })
    )
  })
  test('Ensure that when a new env is created, that env is selected', async () => {
    const onChangeMock = jest.fn()
    const setenvOptionsMock = jest.fn()
    const { container } = render(
      <TestWrapper>
        <MapPrometheusMetricToService
          onChange={onChangeMock}
          serviceOptions={[]}
          environmentOptions={[]}
          setPrometheusGroupNames={jest.fn()}
          setEnvironmentOptions={setenvOptionsMock}
          setServiceOptions={jest.fn()}
        />
      </TestWrapper>
    )

    await waitFor(() => expect(container.querySelector('.addEnv')).not.toBeNull())
    const button = container.querySelector('button.addEnv')
    if (!button) {
      throw Error('add env button not rendered')
    }
    fireEvent.click(button)
    await waitFor(() => expect(setenvOptionsMock).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(onChangeMock).toHaveBeenCalledWith(MapPrometheusQueryToServiceFieldNames.ENVIRONMENT, {
        label: 'newEnv',
        value: 'newEnv'
      })
    )
  })
})
