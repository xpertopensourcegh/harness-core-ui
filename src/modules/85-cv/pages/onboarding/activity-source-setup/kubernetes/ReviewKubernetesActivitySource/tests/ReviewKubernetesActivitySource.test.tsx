import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import type { UseMutateReturn } from 'restful-react'
import { TestWrapper, TestWrapperProps } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import * as cvService from 'services/cv'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import { ReviewKubernetesActivitySource } from '../ReviewKubernetesActivitySource'

const testWrapperProps: TestWrapperProps = {
  path: routes.toCVActivitySourceSetup({ ...accountPathProps, ...projectPathProps }),
  pathParams: {
    accountId: '1234_accountId',
    projectIdentifier: '1234_project',
    orgIdentifier: '1234_ORG'
  }
}

const testEditModeWrapperProps: TestWrapperProps = {
  path: routes.toCVActivitySourceEditSetup({
    ...accountPathProps,
    ...projectPathProps,
    activitySource: ':activitySource',
    activitySourceId: ':activitySourceId'
  }),
  pathParams: {
    accountId: '1234_accountId',
    projectIdentifier: '1234_project',
    orgIdentifier: '1234_ORG',
    activitySource: 'activitySource',
    activitySourceId: 'activitySourceId'
  }
}

describe('Unit tests for ReviewKubernetesActivitySource', () => {
  test('Ensure data is displayed and api payload is correct', async () => {
    const onPreviousMock = jest.fn()
    const onSubmitMock = jest.fn()
    const postPayloadMock = jest.fn()
    const useRegisterKubernetesSourceSpy = jest.spyOn(cvService, 'useCreateActivitySource')
    const routeCVAdminSetupSpy = jest.spyOn(routes, 'toCVAdminSetup')
    useRegisterKubernetesSourceSpy.mockReturnValue({
      mutate: postPayloadMock as unknown
    } as UseMutateReturn<any, any, any, any, any>)

    const { container } = render(
      <TestWrapper {...testWrapperProps}>
        <ReviewKubernetesActivitySource
          data={{
            connectorType: 'Kubernetes',
            selectedNamespaces: ['namespace1', 'namespace2'],
            selectedWorkloads: new Map([
              [
                'namespace1',
                new Map([
                  [
                    'workload1',
                    {
                      environmentIdentifier: { label: 'env_1', value: 'env_1' },
                      serviceIdentifier: { label: 'service_1', value: 'service_1' },
                      selected: true,
                      workload: 'workload1'
                    }
                  ]
                ])
              ],
              [
                'namespace2',
                new Map([
                  [
                    'workload2',
                    {
                      environmentIdentifier: { label: 'env_2', value: 'env_2' },
                      serviceIdentifier: { label: 'service_2', value: 'service_2' },
                      selected: true,
                      workload: 'workload2'
                    }
                  ]
                ])
              ]
            ]),
            connectorRef: { value: 'kubeConnector2', label: 'kubeConnector2' },
            name: 'solo-dolo',
            identifier: 'solo-dolo-iden'
          }}
          onPrevious={onPreviousMock}
          onSubmit={onSubmitMock}
        />
      </TestWrapper>
    )

    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())
    const tableRows = container.querySelectorAll('[role="row"]')
    expect(tableRows.length).toBe(3)

    const firstRowColumns = tableRows[1].querySelectorAll('[role="cell"]')
    expect(firstRowColumns.length).toBe(4)

    expect(firstRowColumns[0].children[0].innerHTML).toEqual('namespace1')
    expect(firstRowColumns[1].children[0].innerHTML).toEqual('workload1')
    expect(firstRowColumns[2].children[0].innerHTML).toEqual('service_1')
    expect(firstRowColumns[3].children[0].innerHTML).toEqual('env_1')

    const secondRowColumns = tableRows[2].querySelectorAll('[role="cell"]')
    expect(secondRowColumns.length).toBe(4)

    expect(secondRowColumns[0].children[0].innerHTML).toEqual('namespace2')
    expect(secondRowColumns[1].children[0].innerHTML).toEqual('workload2')
    expect(secondRowColumns[2].children[0].innerHTML).toEqual('service_2')
    expect(secondRowColumns[3].children[0].innerHTML).toEqual('env_2')

    const buttons = container.querySelectorAll('button')
    fireEvent.click(buttons[0])
    await waitFor(() => expect(onPreviousMock).toHaveBeenCalledTimes(1))

    fireEvent.click(buttons[1])
    await waitFor(() => expect(routeCVAdminSetupSpy).toHaveBeenCalledTimes(1))

    expect(postPayloadMock).toHaveBeenCalledWith({
      activitySourceConfigs: [
        {
          envIdentifier: 'env_1',
          namespace: 'namespace1',
          serviceIdentifier: 'service_1',
          workloadName: 'workload1'
        },
        {
          envIdentifier: 'env_2',
          namespace: 'namespace2',
          serviceIdentifier: 'service_2',
          workloadName: 'workload2'
        }
      ],
      connectorIdentifier: 'kubeConnector2',
      identifier: 'solo-dolo-iden',
      name: 'solo-dolo',
      orgIdentifier: '1234_ORG',
      projectIdentifier: '1234_project',
      type: 'KUBERNETES',
      uuid: undefined
    })
  })

  test('Ensure data is displayed and api payload is correct in edit mode', async () => {
    const onPreviousMock = jest.fn()
    const onSubmitMock = jest.fn()
    const postPayloadMock = jest.fn()
    const useRegisterKubernetesSourceSpy = jest.spyOn(cvService, 'usePutActivitySource')
    const routeCVAdminSetupSpy = jest.spyOn(routes, 'toCVAdminSetup')
    useRegisterKubernetesSourceSpy.mockReturnValue({
      mutate: postPayloadMock as unknown
    } as UseMutateReturn<any, any, any, any, any>)

    const { container } = render(
      <TestWrapper {...testEditModeWrapperProps}>
        <ReviewKubernetesActivitySource
          data={{
            connectorType: 'Kubernetes',
            selectedNamespaces: ['namespace1', 'namespace2'],
            selectedWorkloads: new Map([
              [
                'namespace1',
                new Map([
                  [
                    'workload1',
                    {
                      environmentIdentifier: { label: 'env_1', value: 'env_1' },
                      serviceIdentifier: { label: 'service_1', value: 'service_1' },
                      selected: true,
                      workload: 'workload1'
                    }
                  ]
                ])
              ],
              [
                'namespace2',
                new Map([
                  [
                    'workload2',
                    {
                      environmentIdentifier: { label: 'env_2', value: 'env_2' },
                      serviceIdentifier: { label: 'service_2', value: 'service_2' },
                      selected: true,
                      workload: 'workload2'
                    }
                  ]
                ])
              ]
            ]),
            connectorRef: { value: 'kubeConnector2', label: 'kubeConnector2' },
            name: 'solo-dolo',
            identifier: 'solo-dolo-iden'
          }}
          onPrevious={onPreviousMock}
          onSubmit={onSubmitMock}
        />
      </TestWrapper>
    )

    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())
    const tableRows = container.querySelectorAll('[role="row"]')
    expect(tableRows.length).toBe(3)

    const firstRowColumns = tableRows[1].querySelectorAll('[role="cell"]')
    expect(firstRowColumns.length).toBe(4)

    expect(firstRowColumns[0].children[0].innerHTML).toEqual('namespace1')
    expect(firstRowColumns[1].children[0].innerHTML).toEqual('workload1')
    expect(firstRowColumns[2].children[0].innerHTML).toEqual('service_1')
    expect(firstRowColumns[3].children[0].innerHTML).toEqual('env_1')

    const secondRowColumns = tableRows[2].querySelectorAll('[role="cell"]')
    expect(secondRowColumns.length).toBe(4)

    expect(secondRowColumns[0].children[0].innerHTML).toEqual('namespace2')
    expect(secondRowColumns[1].children[0].innerHTML).toEqual('workload2')
    expect(secondRowColumns[2].children[0].innerHTML).toEqual('service_2')
    expect(secondRowColumns[3].children[0].innerHTML).toEqual('env_2')

    const buttons = container.querySelectorAll('button')
    fireEvent.click(buttons[0])
    await waitFor(() => expect(onPreviousMock).toHaveBeenCalledTimes(1))

    fireEvent.click(buttons[1])
    await waitFor(() => expect(routeCVAdminSetupSpy).toHaveBeenCalledTimes(1))

    expect(postPayloadMock).toHaveBeenCalledWith({
      activitySourceConfigs: [
        {
          envIdentifier: 'env_1',
          namespace: 'namespace1',
          serviceIdentifier: 'service_1',
          workloadName: 'workload1'
        },
        {
          envIdentifier: 'env_2',
          namespace: 'namespace2',
          serviceIdentifier: 'service_2',
          workloadName: 'workload2'
        }
      ],
      connectorIdentifier: 'kubeConnector2',
      identifier: 'solo-dolo-iden',
      name: 'solo-dolo',
      orgIdentifier: '1234_ORG',
      projectIdentifier: '1234_project',
      type: 'KUBERNETES',
      uuid: undefined
    })
  })
})
