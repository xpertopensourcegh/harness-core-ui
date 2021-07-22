import React from 'react'
import { act, fireEvent, render, waitFor } from '@testing-library/react'
import { Container } from '@wings-software/uicore'
import { findDialogContainer, TestWrapper } from '@common/utils/testUtils'
import { clickSubmit } from '@common/utils/JestFormHelper'
import PerspectiveReportsAndBudgets from '../PerspectiveReportsAndBudgets'
import PerspectiveScheduledReportsResponse from './PerspectiveScheduledReportsResponse.json'
import PerspectiveBudgetsResponse from './PerspectiveBudgetsResponse.json'
import PerspectiveResponse from './PerspectiveResponse.json'
import useBudgetModal from '../PerspectiveCreateBudget'

jest.mock('services/ce', () => ({
  useGetReportSetting: jest.fn().mockImplementation(() => {
    return { data: PerspectiveScheduledReportsResponse, refetch: jest.fn(), error: null, loading: false }
  }),
  useDeleteReportSetting: jest.fn().mockImplementation(() => ({
    mutate: async () => {
      return {
        status: 'SUCCESS',
        data: {}
      }
    }
  })),
  useDeleteBudget: jest.fn().mockImplementation(() => ({
    mutate: async () => {
      return {
        status: 'SUCCESS',
        data: {}
      }
    }
  })),
  useListBudgetsForPerspective: jest.fn().mockImplementation(() => ({
    data: PerspectiveBudgetsResponse,
    refetch: jest.fn(),
    error: null,
    loading: false
  })),
  useCreateReportSetting: jest.fn().mockImplementation(() => ({
    mutate: async () => {
      return {
        status: 'SUCCESS',
        data: {}
      }
    }
  })),
  useUpdateReportSetting: jest.fn().mockImplementation(() => ({
    mutate: async () => {
      return {
        status: 'SUCCESS',
        data: {}
      }
    }
  })),
  useGetPerspective: jest.fn().mockImplementation(() => ({
    mutate: async () => {
      return {
        status: 'SUCCESS',
        data: PerspectiveResponse
      }
    }
  })),
  useUpdateBudget: jest.fn().mockImplementation(() => ({
    mutate: async () => {
      return {
        status: 'SUCCESS',
        data: {}
      }
    }
  })),
  useCreateBudget: jest.fn().mockImplementation(() => ({
    mutate: async () => {
      return {
        status: 'SUCCESS',
        data: {}
      }
    }
  }))
}))

const params = {
  accountId: 'TEST_ACC',
  perspetiveId: 'perspectiveId',
  perspectiveName: 'sample perspective'
}

describe('test cases for Perspective Reports and Budget page', () => {
  test('should be able to render the reports and budget component', async () => {
    const handlePrevButtonClick = jest.fn().mockImplementationOnce(() => ({}))
    const { container } = render(
      <TestWrapper pathParams={params}>
        <PerspectiveReportsAndBudgets onPrevButtonClick={handlePrevButtonClick} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})

const CreateBudgetWrapper = () => {
  const { openModal } = useBudgetModal({ onSuccess: jest.fn() })
  return (
    <Container>
      <button onClick={() => openModal()} className="openModal" />
    </Container>
  )
}

describe('test cases for Perspective Create Budgets', () => {
  test('should be able to open create budget modal', async () => {
    const { container, getByText } = render(
      <TestWrapper pathParams={params}>
        <CreateBudgetWrapper />
      </TestWrapper>
    )

    const openButton = container.querySelector('.openModal')
    expect(openButton).toBeDefined()

    fireEvent.click(openButton!)

    const modal = findDialogContainer()
    expect(modal).toBeDefined()

    await waitFor(() => Promise.resolve())
    expect(getByText('ce.perspectives.budgets.setBudgetAmount.budgetType')).toBeDefined()
    expect(getByText('ce.perspectives.budgets.setBudgetAmount.specifyAmount')).toBeDefined()

    await act(async () => {
      clickSubmit(modal!)
    })

    expect(getByText('ce.perspectives.budgets.configureAlerts.subTitle')).toBeDefined()
    expect(getByText('ce.perspectives.budgets.configureAlerts.budgetAmount')).toBeDefined()
    expect(findDialogContainer()).toMatchSnapshot()
  })
})
