import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react'
import { prependAccountPath, TestWrapper, UseGetMockData } from 'modules/common/utils/testUtils'
import type { ResponsePageNGPipelineSummaryResponse } from 'services/cd-ng'
import { defaultAppStoreValues } from 'modules/common/pages/ProjectsPage/__tests__/DefaultAppStoreData'
import { routeCDPipelines, routeCDPipelineStudio, routePipelineDetail } from 'modules/cd/routes'
import CDPipelinesPage from '../CDPipelinesPage'
import mocks from './CDPipelineMocks'

const params = {
  accountId: 'testAcc',
  orgIdentifier: 'testOrg',
  projectIdentifier: 'test',
  pipelineIdentifier: 'pipeline1'
}
const onRunPipelineClick: jest.Mock<void> = jest.fn()

jest.mock('modules/cd/components/RunPipelineModal/RunPipelineModal', () => ({
  // eslint-disable-next-line react/display-name
  RunPipelineModal: ({ children }: { children: JSX.Element }) => <div onClick={onRunPipelineClick}>{children}</div>
}))

describe('CD Pipeline Page List', () => {
  test('render card view', async () => {
    const { container, getByTestId } = render(
      <TestWrapper
        path={prependAccountPath(routeCDPipelines.path)}
        pathParams={params}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <CDPipelinesPage mockData={mocks as UseGetMockData<ResponsePageNGPipelineSummaryResponse>} />
      </TestWrapper>
    )
    await waitFor(() => getByTestId(params.pipelineIdentifier))
    expect(container).toMatchSnapshot()
  })

  test('render list view', async () => {
    const { container, getByTestId, getAllByText } = render(
      <TestWrapper
        path={prependAccountPath(routeCDPipelines.path)}
        pathParams={params}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <CDPipelinesPage mockData={mocks as UseGetMockData<ResponsePageNGPipelineSummaryResponse>} />
      </TestWrapper>
    )
    await waitFor(() => getByTestId(params.pipelineIdentifier))
    fireEvent.click(container.querySelector('[icon="list"')!)
    await waitFor(() => getAllByText('pipeline1'))
    expect(container).toMatchSnapshot()
  })

  test('test run pipeline on card view', async () => {
    onRunPipelineClick.mockReset()
    const { getByTestId, getAllByTestId } = render(
      <TestWrapper
        path={prependAccountPath(routeCDPipelines.path)}
        pathParams={params}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <CDPipelinesPage mockData={mocks as UseGetMockData<ResponsePageNGPipelineSummaryResponse>} />
      </TestWrapper>
    )
    await waitFor(() => getByTestId(params.pipelineIdentifier))
    fireEvent.click(getAllByTestId('card-run-pipeline')[0]!)
    expect(onRunPipelineClick).toHaveBeenCalled()
  })

  test('test Pipeline click on card view', async () => {
    const { getByTestId } = render(
      <TestWrapper
        path={prependAccountPath(routeCDPipelines.path)}
        pathParams={params}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <CDPipelinesPage mockData={mocks as UseGetMockData<ResponsePageNGPipelineSummaryResponse>} />
      </TestWrapper>
    )
    await waitFor(() => getByTestId(params.pipelineIdentifier))
    fireEvent.click(getByTestId('pipeline1')!)
    await waitFor(() => getByTestId('location'))
    expect(getByTestId('location').innerHTML.endsWith(routePipelineDetail.url(params))).toBeTruthy()
  })

  test('test Add Pipeline on card view', async () => {
    const { getByTestId, getAllByTestId } = render(
      <TestWrapper
        path={prependAccountPath(routeCDPipelines.path)}
        pathParams={params}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <CDPipelinesPage mockData={mocks as UseGetMockData<ResponsePageNGPipelineSummaryResponse>} />
      </TestWrapper>
    )
    await waitFor(() => getByTestId(params.pipelineIdentifier))
    fireEvent.click(getAllByTestId('add-pipeline')[0]!)
    await waitFor(() => getByTestId('location'))
    expect(
      getByTestId('location').innerHTML.endsWith(routeCDPipelineStudio.url({ ...params, pipelineIdentifier: '-1' }))
    ).toBeTruthy()
  })
})
