import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { useSaveDataSourceCVConfigs } from 'services/cv'
import ReviewTiersAndApps from '../ReviewTiersAndApps'

jest.mock('react-router-dom', () => ({
  useParams: () => ({
    accountId: 'accountIdMock',
    projectIdentifier: 'projectIdMock',
    orgIdentifier: 'orgIdMock'
  }),
  useHistory: jest.fn(() => {
    return {
      push: jest.fn(),
      location: {
        search: '' // edit mode otherwise e.g. "?triggerType=Webhook&sourceRepo=GITHUB"
      }
    }
  })
}))
jest.mock('@cv/hooks/IndexedDBHook/IndexedDBHook', () => ({
  useIndexedDBHook: jest.fn().mockImplementation(() => {
    return { isInitializingDB: false, dbInstance: { get: jest.fn() } }
  }),
  CVObjectStoreNames: {}
}))

jest.mock('framework/exports', () => ({
  ...(jest.requireActual('framework/exports') as object),
  useStrings: () => ({
    getString: () => 'xx'
  })
}))

jest.mock('services/cv', () => ({
  useSaveDataSourceCVConfigs: jest.fn().mockReturnValue({
    loading: false,
    mutate: jest.fn()
  })
}))

const appsAndTiers = {
  applications: {
    1: {
      id: 1,
      name: 'app1',
      environment: 'qa'
    }
  },
  tiers: {
    22: {
      id: 22,
      name: 'tier1',
      appId: 1,
      service: 'test-service-a',
      totalTiers: 10
    },
    33: {
      id: 33,
      name: 'tier2',
      appId: 1,
      service: 'test-service-b',
      totalTiers: 10
    }
  }
}

describe('ReviewTiersAndApps', () => {
  const mutateCallback = jest.fn()
  beforeEach(() => {
    mutateCallback.mockClear()
  })
  test('matches snapshot', () => {
    const { container } = render(<ReviewTiersAndApps stepData={{ ...appsAndTiers }} onCompleteStep={jest.fn()} />)
    expect(container).toMatchSnapshot()
  })

  test('onNext handles saving correctly', () => {
    ;(useSaveDataSourceCVConfigs as any).mockReturnValue({
      loading: false,
      mutate: mutateCallback
    })
    const { container } = render(
      <ReviewTiersAndApps
        stepData={{
          ...appsAndTiers,
          identifier: 'testID',
          connectorRef: { value: 'test' },
          product: 'Application Monitoring',
          metricPacks: [{ identifier: 'mp1' }, { identifier: 'mp2' }]
        }}
        onCompleteStep={jest.fn()}
      />
    )
    fireEvent.click(container.querySelector('button[type=submit]')!)
    const payload = mutateCallback.mock.calls[0][0]
    expect(payload[0].connectorIdentifier).toEqual('test')
    expect(payload[0].type).toEqual('APP_DYNAMICS')
    expect(payload[0].accountId).toEqual('accountIdMock')
    expect(payload[0].productName).toEqual('Application Monitoring')
    expect(payload[0].applicationName).toEqual('app1')
  })
})
