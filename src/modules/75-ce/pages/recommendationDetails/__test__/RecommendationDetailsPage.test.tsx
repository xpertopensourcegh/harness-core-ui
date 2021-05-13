import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'

import RecommendationDetailsPage from '../RecommendationDetailsPage'
import ResponseData from './DetailsData.json'

jest.mock('@ce/components/CEChart/CEChart', () => 'mock')

const params = {
  accountId: 'TEST_ACC',
  orgIdentifier: 'TEST_ORG',
  projectIdentifier: 'TEST_PROJECT',
  recommendation: 'RECOMMENDATION_ID'
}

jest.mock('@common/hooks/useGraphQLQuery', () => ({
  useGraphQLQuery: jest.fn().mockImplementation(() => ({
    data: ResponseData,
    initLoading: true
  }))
}))

describe('test cases for Recommendation List Page', () => {
  test('should be able to render the list page', async () => {
    const { container } = render(
      <TestWrapper pathParams={params}>
        <RecommendationDetailsPage />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
