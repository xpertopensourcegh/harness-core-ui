import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import { OnBoardingPageHeader } from '../OnBoardingPageHeader'

describe('Unit tests for onboardingPageWrapper', () => {
  test('Ensure page renders content properly', async () => {
    const urlArray = [
      { url: 'someRandoUrl', label: 'Activity' },
      { url: 'someOtherRandomURL', label: 'Activity 5' }
    ]

    const { container, getByText } = render(
      <TestWrapper
        path={routes.toCVOnBoardingSetup({ ...accountPathProps, ...projectPathProps })}
        pathParams={{
          accountId: 'loading',
          projectIdentifier: '1234_project',
          orgIdentifier: '1234_ORG'
        }}
      >
        <OnBoardingPageHeader breadCrumbs={urlArray} />
      </TestWrapper>
    )

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
