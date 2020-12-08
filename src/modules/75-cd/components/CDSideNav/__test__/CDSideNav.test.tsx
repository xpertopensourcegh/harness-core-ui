import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import CDSideNav from '../CDSideNav'

describe('Sidenav', () => {
  test('render', () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/cd/deployments/orgs/:orgIdentifier/projects/:projectIdentifier"
        pathParams={{ accountId: 'dummy', orgIdentifier: 'dummy', projectIdentifier: 'dummy' }}
      >
        <CDSideNav />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
