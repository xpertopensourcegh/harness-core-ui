import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import ResourcesPage from '../ResourcesPage'

describe('Resources Page', () => {
  test('render', () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/admin/resources/" pathParams={{ accountId: 'dummy' }}>
        <ResourcesPage>hello</ResourcesPage>
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
