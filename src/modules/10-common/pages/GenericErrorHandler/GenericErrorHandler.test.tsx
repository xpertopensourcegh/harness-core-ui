import React from 'react'
import { render } from '@testing-library/react'

import { TestWrapper } from '@common/utils/testUtils'
import GenericErrorHandler from './GenericErrorHandler'

describe('GenericErrorHandler', () => {
  test('render', () => {
    const { container } = render(
      <TestWrapper path="/abc">
        <GenericErrorHandler />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
