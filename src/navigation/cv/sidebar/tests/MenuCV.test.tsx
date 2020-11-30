import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { Container } from '@wings-software/uikit'
import { TestWrapper } from '@common/utils/testUtils'
import * as framework from 'framework/route/RouteMounter'
import { MenuCV } from '../MenuCV'

jest.mock('@common/components/ProjectSelector/ProjectSelector', () => ({
  ...(jest.requireActual('@common/components/ProjectSelector/ProjectSelector') as object),
  ProjectSelector: function Wrapper() {
    return <Container />
  }
}))

describe('Unit tests for MenuCV', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const mockRouteParams = jest.spyOn(framework, 'useRouteParams')
    mockRouteParams.mockReturnValue({
      params: {
        accountId: '1234_accountId',
        projectIdentifier: '1234_project',
        orgIdentifier: '1234_ORG'
      },
      query: {}
    })
  })
  test('Ensure nav renders with correct links', async () => {
    const { container } = render(
      <TestWrapper>
        <MenuCV />
      </TestWrapper>
    )

    await waitFor(() => expect(container.querySelector('[class*="topBar"]')).not.toBeNull())
    expect(container).toMatchSnapshot()
  })
})
