import React from 'react'
import userEvent from '@testing-library/user-event'
import { render, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import HealthSourceDrawerHeader from '../HealthSourceDrawerHeader'

describe('Validate HealthSourceDrawerHeader', async () => {
  //

  test('should render in cv', async () => {
    const { container, getByText } = render(
      <TestWrapper>
        <HealthSourceDrawerHeader />
      </TestWrapper>
    )
    await waitFor(() => expect(getByText('cv.healthSource.addHealthSource')).toBeInTheDocument())
    await waitFor(() => expect(getByText('cv.healthSource.backtoMonitoredService')).toBeInTheDocument())
    expect(container).toMatchSnapshot()
  })

  test('should render in cv when isEdit is true', async () => {
    const { container, getByText } = render(
      <TestWrapper>
        <HealthSourceDrawerHeader isEdit />
      </TestWrapper>
    )
    await waitFor(() => expect(getByText('cv.healthSource.editHealthSource')).toBeInTheDocument())
    await waitFor(() => expect(getByText('cv.healthSource.backtoMonitoredService')).toBeInTheDocument())
    expect(container).toMatchSnapshot()
  })

  test('should render', async () => {
    const { container, getByText } = render(
      <TestWrapper>
        <HealthSourceDrawerHeader breadCrumbRoute={{ routeTitle: 'Test title' }} />
      </TestWrapper>
    )
    await waitFor(() => expect(getByText('cv.healthSource.addHealthSource')).toBeInTheDocument())
    await waitFor(() => expect(getByText('Test title')).toBeInTheDocument())
    expect(container).toMatchSnapshot()
  })

  test('should render with shouldRenderAtVerifyStep true', async () => {
    const clickBreadCrumb = jest.fn()
    const { container, getByText } = render(
      <TestWrapper>
        <HealthSourceDrawerHeader
          onClick={clickBreadCrumb}
          shouldRenderAtVerifyStep
          breadCrumbRoute={{ routeTitle: 'Test title' }}
        />
      </TestWrapper>
    )
    await waitFor(() => expect(getByText('cv.healthSource.addHealthSource')).toBeInTheDocument())
    await waitFor(() => expect(getByText('Test title')).toBeInTheDocument())
    userEvent.click(getByText('Test title'))
    await waitFor(() => expect(clickBreadCrumb).toHaveBeenCalled())
    expect(container).toMatchSnapshot()
  })
})
