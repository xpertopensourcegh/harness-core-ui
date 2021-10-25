import React from 'react'
import userEvent from '@testing-library/user-event'
import { render, queryByText, waitFor } from '@testing-library/react'
import { findDialogContainer, TestWrapper } from '@common/utils/testUtils'
import { testWrapperProps } from '@cv/pages/monitored-service/CVMonitoredService/__test__/CVMonitoredService.test'
import GraphSummaryCard from '../components/GraphSummaryCard/GraphSummaryCard'
import { monitoredService } from './CVMonitoredService.mock'

const onToggleService = jest.fn()
const onEditService = jest.fn()
const onDeleteService = jest.fn()

describe('GraphSummaryCard', () => {
  test('Render GraphSummaryCard', () => {
    const { container } = render(
      <TestWrapper {...testWrapperProps}>
        <GraphSummaryCard
          monitoredService={monitoredService}
          onEditService={onEditService}
          onDeleteService={onDeleteService}
          onToggleService={onToggleService}
        />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })

  test('onEditService', async () => {
    const { container } = render(
      <TestWrapper {...testWrapperProps}>
        <GraphSummaryCard
          monitoredService={monitoredService}
          onEditService={onEditService}
          onDeleteService={onDeleteService}
          onToggleService={onToggleService}
        />
      </TestWrapper>
    )

    userEvent.click(container.querySelectorAll('[data-icon="Edit"]')[0])

    expect(onEditService).toBeCalledWith(monitoredService.identifier)
  })

  test('onDeleteService', async () => {
    const { container } = render(
      <TestWrapper {...testWrapperProps}>
        <GraphSummaryCard
          monitoredService={monitoredService}
          onEditService={onEditService}
          onDeleteService={onDeleteService}
          onToggleService={onToggleService}
        />
      </TestWrapper>
    )

    userEvent.click(container.querySelector('[data-icon="trash"]')!)

    await waitFor(() => queryByText(document.body, `yes`))
    const confirmDialog = findDialogContainer()
    expect(confirmDialog).toBeInTheDocument()

    const confirmButton = queryByText(confirmDialog!, 'yes')
    userEvent.click(confirmButton!)

    expect(onDeleteService).toBeCalledWith(monitoredService.identifier)
  })
})
