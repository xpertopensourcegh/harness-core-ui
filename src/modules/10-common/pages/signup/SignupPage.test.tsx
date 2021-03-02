import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import SignupPage from './SignupPage'

describe('Signup Page', () => {
  test('The signup page renders', () => {
    const { container } = render(
      <TestWrapper path={routes.toSignup()}>
        <SignupPage />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
