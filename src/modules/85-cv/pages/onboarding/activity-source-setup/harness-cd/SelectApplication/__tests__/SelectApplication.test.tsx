import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { TestWrapper } from '@common/utils/testUtils'
import SelectApplication from '../SelectApplication'
import mockData from './mockData.json'

describe('SelectApplication', () => {
  test('render', async () => {
    const { container, getByText } = render(
      <MemoryRouter>
        <TestWrapper>
          <SelectApplication
            onPrevious={jest.fn()}
            mockData={{ data: mockData as any, loading: false }}
            stepData={{ applications: { appId: { name: 'appName' } } }}
          />
        </TestWrapper>
      </MemoryRouter>
    )
    expect(getByText('HARNESS CD 1.0 APPLICATION')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
