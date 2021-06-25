import React from 'react'
import { render } from '@testing-library/react'

import RedirectPage from '../Redirect'

jest.mock('@common/hooks', () => ({
  ...(jest.requireActual('@common/hooks') as any),
  useQueryParams: jest.fn().mockImplementation(() => ({ returnUrl: '/testing' }))
}))
describe('Redirect Page', () => {
  test('redirect page ', () => {
    const { container } = render(<RedirectPage></RedirectPage>)
    expect(container).toMatchSnapshot()
  })
})
