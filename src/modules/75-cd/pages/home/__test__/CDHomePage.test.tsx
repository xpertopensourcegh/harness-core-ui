import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import CDHomePage from '../CDHomePage'

describe('CDHomePage snapshot test', () => {
  test('should render properly', async () => {
    const { container } = render(
      <TestWrapper pathParams={{ orgIdentifier: 'dummy' }}>
        <CDHomePage />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
