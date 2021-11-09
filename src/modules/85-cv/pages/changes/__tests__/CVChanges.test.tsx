import React from 'react'
import { render } from '@testing-library/react'
import { Container } from '@wings-software/uicore'
import { TestWrapper } from '@common/utils/testUtils'
import { RiskValues } from '@cv/utils/CommonUtils'
import { mockedHealthScoreData } from '@cv/pages/monitored-service/components/ServiceHealth/__tests__/ServiceHealth.mock'
import { changeSummaryWithPositiveChange } from '@cv/pages/monitored-service/CVMonitoredService/__test__/CVMonitoredService.mock'
import Button from '@rbac/components/Button/Button'
import { CVChanges } from '../CVChanges'

const WrapperComponent = (): JSX.Element => {
  const updateTime = new Date(2021)
  return (
    <TestWrapper>
      <CVChanges updateTime={updateTime} />
    </TestWrapper>
  )
}

const fetchHealthScore = jest.fn()

jest.mock('highcharts-react-official', () => () => <></>)

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
jest.mock('services/cv', () => ({
  useSaveMonitoredService: () =>
    jest.fn().mockImplementation(() => ({ loading: false, error: null, data: {}, refetch: jest.fn() })),
  useUpdateMonitoredService: () =>
    jest.fn().mockImplementation(() => ({ loading: false, error: null, data: {}, refetch: jest.fn() })),
  useGetMonitoredServiceScoresFromServiceAndEnvironment: jest.fn().mockImplementation(() => ({
    data: { currentHealthScore: { riskStatus: RiskValues.HEALTHY, healthScore: 100 } },
    loading: false,
    error: null,
    refetch: jest.fn()
  })),
  useGetMonitoredServiceOverAllHealthScoreWithServiceAndEnv: jest.fn().mockImplementation(() => {
    return { data: mockedHealthScoreData, refetch: fetchHealthScore, error: null, loading: false }
  }),
  useGetServiceDependencyGraph: jest.fn().mockImplementation(() => {
    return {
      data: {},
      refetch: jest.fn(),
      error: null,
      loading: false
    }
  }),
  useGetAnomaliesSummary: jest.fn().mockImplementation(() => {
    return {
      data: {},
      refetch: jest.fn(),
      error: null,
      loading: false
    }
  }),
  useChangeEventSummary: jest.fn().mockImplementation(() => {
    return {
      data: { resource: { ...changeSummaryWithPositiveChange } },
      refetch: jest.fn(),
      error: null,
      loading: false
    }
  }),
  useChangeEventList: jest.fn().mockImplementation(() => {
    return {
      data: {},
      refetch: jest.fn(),
      error: null,
      loading: false
    }
  }),
  useChangeEventTimeline: jest.fn().mockImplementation(() => {
    return {
      data: {},
      refetch: jest.fn(),
      error: null,
      loading: false,
      cancel: jest.fn()
    }
  })
}))

describe('Unit tests for ServiceHealth', () => {
  test('Verify if all the fields are rendered correctly inside ServiceHealth', async () => {
    const { container } = render(<WrapperComponent />)
    expect(container).toMatchSnapshot()
  })
})
