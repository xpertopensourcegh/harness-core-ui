import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import type { UseMutateReturn } from 'restful-react'
import * as routeMounter from 'framework/route/RouteMounter'
import { TestWrapper } from '@common/utils/testUtils'
import * as cvService from 'services/cv'
import { ReviewKubernetesActivitySource } from '../ReviewKubernetesActivitySource'

describe('Unit tests for ReviewKubernetesActivitySource', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const mockRouteParams = jest.spyOn(routeMounter, 'useRouteParams')
    mockRouteParams.mockReturnValue({
      params: {
        accountId: 'loading',
        projectIdentifier: '1234_project',
        orgIdentifier: '1234_ORG'
      },
      query: {}
    })
  })
  test('Ensure data is displayed and api payload is correct', async () => {
    const onPreviousMock = jest.fn()
    const onSubmitMock = jest.fn()
    const postPayloadMock = jest.fn()
    const useRegisterKubernetesSourceSpy = jest.spyOn(cvService, 'useRegisterKubernetesSource')
    useRegisterKubernetesSourceSpy.mockReturnValue({
      mutate: postPayloadMock as unknown
    } as UseMutateReturn<any, any, any, any, any>)

    const { container } = render(
      <TestWrapper>
        <ReviewKubernetesActivitySource
          data={{
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
            connectorRef: { value: 'kubeConnector2' },
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
    await waitFor(() => expect(onSubmitMock).toHaveBeenCalledTimes(1))

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
      uuid: undefined
    })
  })
})
