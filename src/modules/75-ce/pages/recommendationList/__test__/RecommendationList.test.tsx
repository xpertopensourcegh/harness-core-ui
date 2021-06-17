import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'urql'
import { fromValue } from 'wonka'
import { TestWrapper } from '@common/utils/testUtils'

import RecommendationList from '../RecommendationList'
import ResponseData from './ListData.json'

const params = { accountId: 'TEST_ACC', orgIdentifier: 'TEST_ORG', projectIdentifier: 'TEST_PROJECT' }

describe('test cases for Recommendation List Page', () => {
  test('should be able to render the list page', async () => {
    const responseState = {
      executeQuery: () => fromValue(ResponseData)
    }

    const { container } = render(
      <TestWrapper pathParams={params}>
        <Provider value={responseState as any}>
          <RecommendationList />
        </Provider>
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
