import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'

describe('Unit tests for createAppd monitoring source', () => {
  test('Component renders', () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}></TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
