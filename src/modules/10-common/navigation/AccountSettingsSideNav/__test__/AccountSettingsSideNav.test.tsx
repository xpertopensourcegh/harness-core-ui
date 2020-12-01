import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import SideNav from '../AccountSettingsSideNav'

describe('Resources Page', () => {
  test('render', () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/admin/resources/" pathParams={{ accountId: 'dummy' }}>
        <SideNav />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
