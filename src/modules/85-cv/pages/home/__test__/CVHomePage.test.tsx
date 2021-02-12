import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import CVHomePage from '../CVHomePage'

describe('CVHomePage snapshot test', () => {
  test('should render properly', async () => {
    const { container } = render(
      <TestWrapper pathParams={{ orgIdentifier: 'dummy' }}>
        <CVHomePage />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
