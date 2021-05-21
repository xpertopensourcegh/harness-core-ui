import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import type { UseGetReturn } from 'restful-react'
import { FormikForm } from '@wings-software/uicore'
import { Formik } from 'formik'
import * as cvService from 'services/cv'
import { TestWrapper } from '@common/utils/testUtils'
import { MapPrometheusQueryToServiceFieldNames } from '../../../constants'
import { QueryViewer, QueryViewerProps } from '../QueryViewer'

function WrapperComponent(props: QueryViewerProps) {
  return (
    <TestWrapper>
      <Formik initialValues={{}} onSubmit={jest.fn()}>
        <FormikForm>
          <QueryViewer {...props} />
        </FormikForm>
      </Formik>
    </TestWrapper>
  )
}

describe('Unit tests for PrometheusFilterSelector', () => {
  test('Ensure sent in query is correctly built', async () => {
    const refetchMock = jest.fn()
    jest.spyOn(cvService, 'useGetSampleData').mockReturnValue({
      data: {
        data: {
          metricDetails: { soloDolo: 'sdadasd', fancy: 'sdfsdf' },
          data: [
            { timestamp: 13123132, value: 23 },
            { timestamp: 13123132, value: 23 },
            { timestamp: 13123132, value: 23 },
            { timestamp: 13123132, value: 23 },
            { timestamp: 13123132, value: 23 },
            { timestamp: 13123132, value: 23 }
          ]
        }
      },
      refetch: refetchMock as unknown
    } as UseGetReturn<any, any, any, any>)
    const onChangeMock = jest.fn()
    const { container, rerender } = render(
      <WrapperComponent
        onChange={onChangeMock}
        values={{
          prometheusMetric: 'solo-dolo',
          additionalFilter: [{ label: 'addFilter:addFilterValue', value: 'addFilterValue' }],
          envFilter: [{ label: 'envFilter:envFilterValue', value: 'envFilterValue' }],
          serviceFilter: [
            { label: 'serviceFilter:serviceFilterValue', value: 'serviceFilterValue' },
            { label: 'serviceFilter1:serviceFilterValue1', value: 'serviceFilterValue1' }
          ],
          isManualQuery: false,
          query: '',
          metricName: 'Metric1'
        }}
      />
    )
    await waitFor(() =>
      expect(container.querySelector(`textarea[name=${MapPrometheusQueryToServiceFieldNames.QUERY}]`)).not.toBeNull()
    )
    expect(onChangeMock).toHaveBeenCalledTimes(2)

    rerender(
      <WrapperComponent
        onChange={onChangeMock}
        values={{
          prometheusMetric: 'solo-dolo',
          isManualQuery: false,
          query: 'sdfsdfsdf',
          metricName: 'Metric1'
        }}
        connectorIdentifier="12313_conncetor"
      />
    )
    await waitFor(() => expect(refetchMock).toHaveBeenCalledTimes(1))
  })

  test('Ensure loading state is rendering correctly for chart', async () => {
    const refetchMock = jest.fn().mockImplementation(() => {
      return new Promise(() => undefined)
    })
    jest.spyOn(cvService, 'useGetSampleData').mockReturnValue({
      loading: true,
      refetch: refetchMock as unknown
    } as UseGetReturn<any, any, any, any>)
    const onChangeMock = jest.fn()
    const { container } = render(
      <WrapperComponent
        onChange={onChangeMock}
        connectorIdentifier="adasd"
        values={{
          prometheusMetric: 'solo-dolo',
          isManualQuery: false,
          query: 'dsfsdfsfd',
          metricName: 'Metric1'
        }}
      />
    )
    await waitFor(() =>
      expect(container.querySelector(`textarea[name=${MapPrometheusQueryToServiceFieldNames.QUERY}]`)).not.toBeNull()
    )
    await waitFor(() => expect(refetchMock).toHaveBeenCalledTimes(1))
    expect(container.querySelector('[data-icon="steps-spinner"]')).not.toBeNull()
  })

  test('Ensure error state is rendering correctly for chart', async () => {
    const refetchMock = jest.fn().mockImplementation()
    jest.spyOn(cvService, 'useGetSampleData').mockReturnValue({
      error: { data: { message: 'mockError' } },
      refetch: refetchMock as unknown
    } as UseGetReturn<any, any, any, any>)
    const onChangeMock = jest.fn()
    const { container, getByText } = render(
      <WrapperComponent
        onChange={onChangeMock}
        connectorIdentifier="adasd"
        values={{
          prometheusMetric: 'solo-dolo',
          isManualQuery: false,
          query: 'dsfsdfsfd',
          metricName: 'Metric1'
        }}
      />
    )
    await waitFor(() =>
      expect(container.querySelector(`textarea[name=${MapPrometheusQueryToServiceFieldNames.QUERY}]`)).not.toBeNull()
    )
    await waitFor(() => expect(refetchMock).toHaveBeenCalledTimes(1))
    expect(getByText('mockError')).not.toBeNull()

    fireEvent.click(getByText('Retry'))
    await waitFor(() => expect(refetchMock).toHaveBeenCalledTimes(2))
  })

  test('Ensure dialog opens when expand icon is clicked', async () => {
    const refetchMock = jest.fn()
    jest.spyOn(cvService, 'useGetSampleData').mockReturnValue({
      data: {
        data: {
          metricDetails: { soloDolo: 'sdadasd', fancy: 'sdfsdf' },
          data: [
            { timestamp: 13123132, value: 23 },
            { timestamp: 13123132, value: 23 },
            { timestamp: 13123132, value: 23 },
            { timestamp: 13123132, value: 23 },
            { timestamp: 13123132, value: 23 },
            { timestamp: 13123132, value: 23 }
          ]
        }
      },
      refetch: refetchMock as unknown
    } as UseGetReturn<any, any, any, any>)
    const onChangeMock = jest.fn()
    const { container } = render(
      <WrapperComponent
        onChange={onChangeMock}
        connectorIdentifier="12343"
        values={{
          prometheusMetric: 'solo-dolo',
          additionalFilter: [{ label: 'addFilter:addFilterValue', value: 'addFilterValue' }],
          envFilter: [{ label: 'envFilter:envFilterValue', value: 'envFilterValue' }],
          serviceFilter: [
            { label: 'serviceFilter:serviceFilterValue', value: 'serviceFilterValue' },
            { label: 'serviceFilter1:serviceFilterValue1', value: 'serviceFilterValue1' }
          ],
          isManualQuery: false,
          query: '',
          metricName: 'Metric1'
        }}
      />
    )

    await waitFor(() =>
      expect(container.querySelector(`textarea[name=${MapPrometheusQueryToServiceFieldNames.QUERY}]`)).not.toBeNull()
    )
    fireEvent.click(container.querySelector('[data-icon="fullscreen"]')!)
    await waitFor(() => expect(document.body.querySelector('[class*="queryViewDialog"]')).not.toBeNull())
    expect(document.body.querySelector(`[class*="queryViewDialog"] textarea`)).not.toBeNull()
    expect(refetchMock).toHaveBeenCalledTimes(2)

    fireEvent.click(document.body)
    await waitFor(() => expect(container.querySelector('[class*="queryViewDialog"]')).toBeNull())
  })
})
