import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { Container, Button } from '@wings-software/uicore'
import * as dbHook from '@cv/hooks/IndexedDBHook/IndexedDBHook'
import { TestWrapper } from '@common/utils/testUtils'
import Configurations from './Configurations'
import { cachedData, editModeData } from './components/Service/__tests__/Service.mock'

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

const fetchMonitoredServiceYAML = jest.fn(() => Promise.resolve({ data: {} }))
const updateMonitoredService = jest.fn()

jest.mock('services/cv', () => ({
  useSaveMonitoredService: jest
    .fn()
    .mockImplementation(() => ({ loading: false, error: null, data: {}, refetch: jest.fn() })),
  useUpdateMonitoredService: jest
    .fn()
    .mockImplementation(() => ({ loading: false, error: null, data: {}, mutate: updateMonitoredService })),
  useGetMonitoredService: jest
    .fn()
    .mockImplementation(() => ({ loading: false, error: null, data: editModeData, refetch: jest.fn() })),
  useGetMonitoredServiceYamlTemplate: jest
    .fn()
    .mockImplementation(() => ({ loading: false, error: null, data: {}, refetch: fetchMonitoredServiceYAML }))
}))

describe('Unit tests for Configuration', () => {
  test('Ensure that any infra change source is removed when switching type to application', async () => {
    jest.spyOn(dbHook, 'useIndexedDBHook').mockReturnValue({
      dbInstance: {
        put: jest.fn(),
        get: jest.fn().mockReturnValue(Promise.resolve({ currentData: cachedData }))
      } as any,
      isInitializingDB: false
    })
    const { container, getByText } = render(
      <TestWrapper>
        <Configurations />
      </TestWrapper>
    )
    // name
    await waitFor(() => expect(container.querySelector('input[value="Application"]')).toBeTruthy())
    expect(getByText('CD 101')).not.toBeNull()
    fireEvent.click(
      container.querySelector(`[class*="monitoredService"] .bp3-input-action [data-icon="chevron-down"]`)!
    )
    await waitFor(() => expect(container.querySelector('[class*="menuItemLabel"]')).not.toBeNull())
    fireEvent.click(getByText('Infrastructure'))
    await waitFor(() => expect(getByText('cv.healthSource.noData')).not.toBeNull())
  })
})
