import React from 'react'
import { Provider } from 'urql'
import { fromValue } from 'wonka'
import type { DocumentNode } from 'graphql'
import { render } from '@testing-library/react'
import { FetchBudgetSummaryDocument, FetchBudgetsGridDataDocument } from 'services/ce/services'
import { TestWrapper } from '@common/utils/testUtils'
import ResponseData from './SummaryData.json'
import GridData from './GridData.json'
import BudgetDetails from '../BudgetDetails'

jest.mock('@ce/components/CEChart/CEChart', () => 'mock')

const params = {
  accountId: 'TEST_ACC',
  budgetId: 'budgetId',
  budgetName: 'budgetName'
}

describe('test cases for Budgets List Page', () => {
  test('should be able to render the budget list page', async () => {
    const responseState = {
      executeQuery: ({ query }: { query: DocumentNode }) => {
        if (query === FetchBudgetSummaryDocument) {
          return fromValue(ResponseData)
        }
        if (query === FetchBudgetsGridDataDocument) {
          return fromValue(GridData)
        }
      }
    }

    const { container } = render(
      <TestWrapper pathParams={params}>
        <Provider value={responseState as any}>
          <BudgetDetails />
        </Provider>
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
