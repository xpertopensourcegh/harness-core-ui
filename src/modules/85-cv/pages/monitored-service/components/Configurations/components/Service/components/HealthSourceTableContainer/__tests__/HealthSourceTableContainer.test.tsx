import React from 'react'
import { act } from 'react-test-renderer'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import HealthSourceTableContainer from '../HealthSourceTableContainer'
import { formFormik, serviceFormik } from './HealthSourceTableContainer.mock'

describe('Validate', () => {
  test('should render HealthSourceTableContainer with no data', () => {
    const { container, getByText } = render(
      <TestWrapper>
        <HealthSourceTableContainer serviceFormFormik={formFormik as any} />
      </TestWrapper>
    )
    expect(getByText('cv.healthSource.noData')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
  test('should render HealthSourceTableContainer with data', async () => {
    const { container, getByText } = render(
      <TestWrapper>
        <HealthSourceTableContainer serviceFormFormik={{ values: serviceFormik } as any} />
      </TestWrapper>
    )
    expect(container.querySelectorAll('.body div[role="row"]').length).toEqual(1)
    act(() => {
      fireEvent.click(getByText('cv.healthSource.addHealthSource'))
    })
    // drawer opens with correct header
    waitFor(() => expect(getByText('cv.healthSource.addHealthSource')).toBeInTheDocument())

    act(() => {
      fireEvent.click(container.querySelector('.body div[role="row"]')!)
    })
    // drawer opens with correct header
    waitFor(() => expect(getByText('cv.healthSource.backtoMonitoredService')).toBeInTheDocument())
    waitFor(() => expect(getByText('cv.healthSource.editHealthSource')).toBeInTheDocument())

    expect(container).toMatchSnapshot()
  })
})
