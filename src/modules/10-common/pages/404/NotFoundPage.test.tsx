import React from 'react'
import { render } from '@testing-library/react'

import { TestWrapper } from '@common/utils/testUtils'
import NotFoundPage from './NotFoundPage'

describe('NotFoundPage', () => {
  test('render', () => {
    const { container } = render(
      <TestWrapper path="/abc">
        <NotFoundPage />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
