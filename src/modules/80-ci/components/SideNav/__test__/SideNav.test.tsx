import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import SideNav from '../SideNav'

describe('Sidenav', () => {
  test('render', () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/ci/dashboard/orgs/:orgIdentifier/projects/:projectIdentifier"
        pathParams={{ accountId: 'dummy', orgIdentifier: 'dummy', projectIdentifier: 'dummy' }}
      >
        <SideNav />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
