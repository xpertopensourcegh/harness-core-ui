import React from 'react'
import { getByText, render, waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { defaultAppStoreValues } from '@common/utils/DefaultAppStoreData'
import { TestWrapper, UseGetMockData } from '@common/utils/testUtils'
import type { ResponsePageNGPipelineSummaryResponse } from 'services/cd-ng'
import { AppStoreContext as StringsContext, AppStoreContextProps } from 'framework/AppStore/AppStoreContext'

import routes from '@common/RouteDefinitions'
import { accountPathProps, pipelineModuleParams, pipelinePathProps } from '@common/utils/routeUtils'
import { useStrings } from 'framework/exports'
import strings from 'strings/strings.en.yaml'
import PipelineModalList from '../PipelineModalListView'
import mocks, { EmptyResponse } from './RunPipelineListViewMocks'

const params = {
  accountId: 'testAcc',
  orgIdentifier: 'testOrg',
  projectIdentifier: 'test',
  pipelineIdentifier: 'pipeline1',
  module: 'cd'
}
const mockGetCallFunction = jest.fn()

jest.mock('services/pipeline-ng', () => ({
  useGetPipelineList: jest.fn().mockImplementation(args => {
    mockGetCallFunction(args)
    return args.mock || mocks
  })
}))
const TEST_PATH = routes.toRunPipeline({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams })

const value: AppStoreContextProps = {
  strings,
  featureFlags: {},
  updateAppStore: jest.fn()
}

const wrapper = ({ children }: React.PropsWithChildren<{}>): React.ReactElement => (
  <StringsContext.Provider value={value}>{children}</StringsContext.Provider>
)
const { result } = renderHook(() => useStrings(), { wrapper })

const noResult = result.current.getString('noSearchResultsFoundPeriod')

describe('PipelineModal List View', () => {
  test('render list view', async () => {
    const { getByTestId, container } = render(
      <TestWrapper path={TEST_PATH} pathParams={params} defaultAppStoreValues={defaultAppStoreValues}>
        <PipelineModalList
          onClose={jest.fn()}
          mockData={mocks as UseGetMockData<ResponsePageNGPipelineSummaryResponse>}
        />
      </TestWrapper>
    )
    await waitFor(() => getByTestId(params.pipelineIdentifier))
    expect(container).toMatchSnapshot()
  })

  test('render empty list view', async () => {
    const { container } = render(
      <TestWrapper path={TEST_PATH} pathParams={params} defaultAppStoreValues={defaultAppStoreValues}>
        <PipelineModalList
          onClose={jest.fn()}
          mockData={EmptyResponse as UseGetMockData<ResponsePageNGPipelineSummaryResponse>}
        />
      </TestWrapper>
    )
    await waitFor(() => getByText(container, noResult))
    expect(container).toMatchSnapshot()
  })
})
