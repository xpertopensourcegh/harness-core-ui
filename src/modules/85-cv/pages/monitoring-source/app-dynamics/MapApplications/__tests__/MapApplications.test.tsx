import React, { useEffect } from 'react'
import { render, fireEvent } from '@testing-library/react'
import xhr, { XhrPromise } from '@wings-software/xhr-async'
import MapApplications, { validateTier, updateTier } from '../MapApplications'
import { ValidationStatus } from '../../AppDOnboardingUtils'

jest.mock('react-router-dom', () => ({
  useParams: () => ({
    accountId: 'accountIdMock',
    projectIdentifier: 'projectIdMock',
    orgIdentifier: 'orgIdMock'
  })
}))

jest.mock('framework/exports', () => ({
  ...(jest.requireActual('framework/exports') as object),
  useStrings: () => ({
    getString: () => 'xx'
  })
}))

jest.mock('services/cv', () => ({
  useGetAppDynamicsTiers: () => ({
    loading: false,
    data: {
      resource: {
        content: [
          {
            id: 1,
            name: 'tier1'
          },
          {
            id: 2,
            name: 'tier2'
          }
        ]
      }
    }
  }),
  useGetMetricPacks: ({ resolve }: any) => {
    useEffect(() => {
      resolve({
        resource: [{ identifier: 'mp1' }, { identifier: 'mp2' }]
      })
    }, [])
  }
}))

jest.mock('@wings-software/xhr-async')

jest.mock('services/cd-ng', () => ({
  useGetServiceListForProject: ({ resolve }: any) => {
    useEffect(() => {
      resolve({
        data: {
          content: [
            {
              identifier: 'service1',
              name: 'Service 1'
            },
            {
              identifier: 'service2',
              name: 'Service 2'
            }
          ]
        }
      })
    }, [])
  }
}))

describe('MapApplications', () => {
  test('matches snapshot', () => {
    const { container } = render(
      <MapApplications
        stepData={{
          applications: {
            1: {
              id: 1,
              name: 'app1',
              environment: 'qa'
            }
          },
          metricPacks: [{ identifier: 'mp1' }]
        }}
        onCompleteStep={jest.fn()}
      />
    )
    expect(container).toMatchSnapshot()
  })

  test('validateTier works as expected', async () => {
    const mockMetricPacks = {}
    const postMock = jest.spyOn(xhr, 'post').mockImplementationOnce(
      () =>
        Promise.resolve({
          response: { resource: [{ overallStatus: 'FAILED' }, { overallStatus: 'NO_DATA' }] }
        }) as XhrPromise<any>
    )
    let result: any = await validateTier(mockMetricPacks as any, { q1: 'q1', q2: 'a2' })
    expect(postMock).toHaveBeenCalled()
    expect(postMock.mock.calls[0][0]).toEqual('/cv/api/appdynamics/metric-data?q1=q1&q2=a2')
    expect(postMock.mock.calls[0][1]).toHaveProperty('data')
    expect(result.validationStatus).toEqual(ValidationStatus.ERROR)

    jest.spyOn(xhr, 'post').mockImplementationOnce(
      () =>
        Promise.resolve({
          response: { resource: [{ overallStatus: 'SUCCESS' }, { overallStatus: 'NO_DATA' }] }
        }) as XhrPromise<any>
    )
    result = await validateTier(mockMetricPacks as any, {})
    expect(result.validationStatus).toEqual(ValidationStatus.NO_DATA)

    jest.spyOn(xhr, 'post').mockImplementationOnce(
      () =>
        Promise.resolve({
          response: { resource: [{ overallStatus: 'SUCCESS' }, { overallStatus: 'SUCCESS' }] }
        }) as XhrPromise<any>
    )
    result = await validateTier(mockMetricPacks as any, {})
    expect(result.validationStatus).toEqual(ValidationStatus.SUCCESS)
  })

  test('updateTier works as expected', () => {
    const update = jest.fn().mockImplementation(fn =>
      fn({
        '22': {
          name: 'tier1',
          appId: '22',
          service: 's1'
        },
        '33': {
          name: 'tier2'
        }
      })
    )

    updateTier(update, 33, { service: 'testServiceName' })
    expect((update.mock.results[0].value as any)['33'].service).toEqual('testServiceName')
    updateTier(update, 22, null)
    expect((update.mock.results[1].value as any)['22']).not.toBeDefined()
  })

  test('Can select tier, metricPack and hit next', () => {
    jest.spyOn(xhr, 'post').mockImplementation(
      () =>
        Promise.resolve({
          response: { resource: [{ overallStatus: 'SUCCESS' }, { overallStatus: 'SUCCESS' }] }
        }) as XhrPromise<any>
    )
    const onCompleteStep = jest.fn()
    const { container, getByText } = render(
      <MapApplications
        stepData={{
          applications: {
            1: {
              id: 1,
              name: 'app1',
              environment: 'qa'
            }
          },
          tiers: {
            1: {
              name: 'tier1',
              appId: 1,
              service: 'test-service'
            },
            2: {
              name: 'tier2',
              appId: 1,
              service: 'test-service2'
            }
          },
          metricPacks: [{ identifier: 'mp1' }]
        }}
        onCompleteStep={onCompleteStep}
      />
    )
    fireEvent.click(container.querySelector('.select-tier')!)
    fireEvent.click(container.querySelectorAll('.metricPacks input[type=checkbox]').item(1))
    fireEvent.click(getByText('Next'))
    expect(onCompleteStep).toHaveBeenCalled()
    const passedTiers: any = onCompleteStep.mock.calls[0][0].tiers
    expect(passedTiers['1']).not.toBeDefined()
    expect(passedTiers['2'].service).toEqual('test-service2')
  })
})
