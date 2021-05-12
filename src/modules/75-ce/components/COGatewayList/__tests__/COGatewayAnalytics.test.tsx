import React from 'react'
import { act } from 'react-dom/test-utils'
import { fireEvent, render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import COGatewayAnalytics from '../COGatewayAnalytics'

const mockServiceData = {
  id: 10,
  name: 'string',
  org_id: 'string',
  account_identifier: 'string',
  project_id: 'string',
  fulfilment: 'string',
  kind: 'string',
  cloud_account_id: 'string',
  idle_time_mins: 10,
  host_name: 'string',
  disabled: false,
  custom_domains: ['custom.doamin.in']
}

const savingsData = {
  service_id: 22,
  potential_cost: 22.0224,
  actual_cost: 0.003047567877888889,
  actual_savings: 22.019352432122112,
  savings_percentage: 99.98616150883696,
  usage_date: '0001-01-01T00:00:00Z',
  idle_hours: 0,
  actual_hours: 0
}

jest.mock('services/lw', () => ({
  useSavingsOfService: jest.fn().mockImplementation(() => ({ data: savingsData, loading: false })),
  useHealthOfService: jest.fn().mockImplementation(() => ({ data: null, loading: false, errors: [] })),
  useAllServiceResources: jest.fn().mockImplementation(() => ({ data: null, loading: false, errors: null })),
  useToggleAutostoppingRule: jest.fn().mockImplementation(() => ({ mutate: Promise.resolve(() => jest.fn()) })),
  useDeleteService: jest.fn().mockImplementation(() => ({ mutate: Promise.resolve(() => jest.fn()) })),
  useGatewaySessionReport: jest.fn().mockImplementation(() => ({ mutate: Promise.resolve(() => jest.fn()) }))
}))

jest.mock('highcharts-react-official', () => () => <div />)

describe('Autostopping rule analytics drawer', () => {
  test('render analytics drawer', () => {
    const { container } = render(
      <TestWrapper>
        <COGatewayAnalytics
          service={{ index: 0, data: mockServiceData }}
          handleServiceToggle={jest.fn()}
          handleServiceDeletion={jest.fn()}
          handleServiceEdit={jest.fn()}
        />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()

    const editIcon = container.querySelector('span[icon="edit"]')
    expect(editIcon).toBeDefined()
    act(() => {
      fireEvent.click(editIcon!)
    })

    const deleteIcon = container.querySelector('span[icon="trash"]')
    expect(deleteIcon).toBeDefined()
    act(() => {
      fireEvent.click(deleteIcon!)
    })
  })
})
