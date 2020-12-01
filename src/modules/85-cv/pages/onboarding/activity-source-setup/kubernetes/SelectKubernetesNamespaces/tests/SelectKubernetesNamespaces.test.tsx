import React from 'react'
import type { UseGetReturn } from 'restful-react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import * as cvService from 'services/cv'
import { TestWrapperProps, TestWrapper } from '@common/utils/testUtils'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import routes from '@common/RouteDefinitions'
import { SelectKubernetesNamespaces } from '../SelectKubernetesNamespaces'
import i18n from '../SelectKubernetesNamespaces.i18n'

const testWrapperProps: TestWrapperProps = {
  path: routes.toCVMainDashBoardPage({ ...accountPathProps, ...projectPathProps }),
  pathParams: {
    accountId: 'loading',
    projectIdentifier: '1234_project',
    orgIdentifier: '1234_ORG'
  }
}

describe('Unit tests for SelectKubernetesNamespaces', () => {
  test('Ensure loading state is rendered, when api is loading', async () => {
    const useGetNamespaces = jest.spyOn(cvService, 'useGetNamespaces')
    useGetNamespaces.mockReturnValue({
      loading: true
    } as UseGetReturn<any, unknown, any, unknown>)

    const onSubmitMockFunc = jest.fn()
    const { container } = render(
      <TestWrapper {...testWrapperProps}>
        <SelectKubernetesNamespaces onSubmit={onSubmitMockFunc} onPrevious={() => undefined} />
      </TestWrapper>
    )
    await waitFor(() => expect(container.querySelector('[class*="loadingErrorNoData"]')).not.toBeNull())
    expect(container.querySelector('[class*="spinner"]')).not.toBeNull()
  })

  test('Ensure error state is rendered, when api errors out', async () => {
    const useGetNamespaces = jest.spyOn(cvService, 'useGetNamespaces')
    const refetchMock = jest.fn()
    useGetNamespaces.mockReturnValue({
      error: { message: 'some execption' },
      refetch: refetchMock as unknown
    } as UseGetReturn<any, unknown, any, unknown>)

    const onSubmitMockFunc = jest.fn()
    const { container, getByText } = render(
      <TestWrapper {...testWrapperProps}>
        <SelectKubernetesNamespaces onSubmit={onSubmitMockFunc} onPrevious={() => undefined} />
      </TestWrapper>
    )
    await waitFor(() => expect(container.querySelector('[class*="loadingErrorNoData"]')).not.toBeNull())
    expect(getByText('some execption')).not.toBeNull()

    fireEvent.click(getByText('Retry'))
    await waitFor(() => expect(refetchMock).toHaveBeenCalledTimes(1))
  })

  test('Ensure no state is rendered when api returns nothing', async () => {
    const useGetNamespaces = jest.spyOn(cvService, 'useGetNamespaces')
    const refetchMock = jest.fn()
    useGetNamespaces.mockReturnValue({
      data: { resource: [] },
      refetch: refetchMock as unknown
    } as UseGetReturn<any, unknown, any, unknown>)

    const onSubmitMockFunc = jest.fn()
    const { container, getByText } = render(
      <TestWrapper {...testWrapperProps}>
        <SelectKubernetesNamespaces onSubmit={onSubmitMockFunc} onPrevious={() => undefined} />
      </TestWrapper>
    )
    await waitFor(() => expect(container.querySelector('[class*="loadingErrorNoData"]')).not.toBeNull())
    expect(getByText(i18n.noDataMessage)).not.toBeNull()

    fireEvent.click(getByText(i18n.retry))
    await waitFor(() => expect(useGetNamespaces).toHaveBeenCalledTimes(3))
  })

  test('Ensure that when data is returned, it is rendered', async () => {
    const useGetNamespaces = jest.spyOn(cvService, 'useGetNamespaces')
    const refetchMock = jest.fn()
    const mockData = ['kubenamespace1', 'kubenamespace2', 'kubenamespace3', 'kubenamespace4', 'kubenamespace5']
    useGetNamespaces.mockReturnValue({
      data: { resource: { content: mockData, pageIndex: 0, totalItems: mockData.length, totalPages: 1, pageSize: 8 } },
      refetch: refetchMock as unknown
    } as UseGetReturn<any, unknown, any, unknown>)

    const onSubmitMockFunc = jest.fn()
    const { container, getByText } = render(
      <TestWrapper {...testWrapperProps}>
        <SelectKubernetesNamespaces onSubmit={onSubmitMockFunc} onPrevious={() => undefined} />
      </TestWrapper>
    )

    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())

    const submitButton = container.querySelector('button[type="submit"]')
    if (!submitButton) {
      throw Error('No button rendered.')
    }

    fireEvent.click(submitButton)
    await waitFor(() => expect(getByText(i18n.validationText.namespace)).not.toBeNull())

    for (const namespace of mockData) {
      expect(getByText(namespace)).not.toBeNull()
    }

    const inputs = container.querySelectorAll('[class*="clickable"]')
    if (!inputs) {
      throw Error('inputs were not rendered.')
    }

    expect(inputs.length).toBe(mockData.length)
    fireEvent.click(inputs[0])
    await waitFor(() => {
      expect(container.querySelectorAll('input[type="checkbox"]')[0].getAttribute('checked')).toBe('')
    })
  })
})
