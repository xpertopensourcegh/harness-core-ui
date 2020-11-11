import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { Container } from '@wings-software/uikit'
import * as framework from 'framework/route/RouteMounter'
import { OnBoardingPageHeader } from '../OnBoardingPageHeader'

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn().mockReturnValue([]),
  Link(props: any) {
    return <Container>{props.children}</Container>
  }
}))

describe('Unit tests for onboardingPageWrapper', () => {
  test('Ensure page renders content properly', async () => {
    const urlArray = [
      { url: 'someRandoUrl', label: 'Activity' },
      { url: 'someOtherRandomURL', label: 'Activity 5' }
    ]
    const mockRouteParams = jest.spyOn(framework, 'useRouteParams')
    mockRouteParams.mockReturnValue({
      params: {
        accountId: 'loading',
        projectIdentifier: '1234_project',
        orgIdentifier: '1234_ORG'
      },
      query: {}
    })
    const { container, getByText } = render(<OnBoardingPageHeader breadCrumbs={urlArray} />)

    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())
    expect(getByText(urlArray[0].label)).not.toBeNull()
    expect(getByText(urlArray[1].label)).not.toBeNull()

    const visualButton = container.querySelector('[class*="viewSelection"]')
    expect(visualButton).not.toBeNull()
    if (!visualButton) {
      throw Error('Visual button was not rendered.')
    }
    fireEvent.click(visualButton)
    expect(container.querySelector('[class*="notSelectedView"]')).toBeNull()
  })
})
