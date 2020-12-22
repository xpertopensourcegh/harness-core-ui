import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { useSaveDSConfig } from 'services/cv'
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
  useSaveDSConfig: jest.fn().mockReturnValue({
    loading: false,
    mutate: jest.fn()
  })
}))

const applications = {
  app1: {
    name: 'app1',
    environment: 'qa',
    totalTiers: 2,
    tiers: {
      tier1: {
        name: 'tier1',
        service: 'test-service-a'
      },
      tier2: {
        name: 'tier2',
        service: 'test-service-b'
      }
    }
  }
}

describe('ReviewTiersAndApps', () => {
  const mutateCallback = jest.fn()
  beforeEach(() => {
    mutateCallback.mockClear()
  })
  test('matches snapshot', () => {
    const { container } = render(<ReviewTiersAndApps stepData={{ applications }} onCompleteStep={jest.fn()} />)
    expect(container).toMatchSnapshot()
  })

  test('onNext handles saving correctly', () => {
    ;(useSaveDSConfig as any).mockReturnValue({
      loading: false,
      mutate: mutateCallback
    })
    const { container } = render(
      <ReviewTiersAndApps
        stepData={{
          applications,
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
    expect(payload.connectorIdentifier).toEqual('test')
    expect(payload.type).toEqual('APP_DYNAMICS')
    expect(payload.accountId).toEqual('accountIdMock')
    expect(payload.productName).toEqual('Application Monitoring')
    expect(payload.appConfigs[0].applicationName).toEqual('app1')
    expect(payload.appConfigs[0].envIdentifier).toEqual('qa')
    expect(payload.appConfigs[0].serviceMappings.length).toEqual(2)
  })
})
