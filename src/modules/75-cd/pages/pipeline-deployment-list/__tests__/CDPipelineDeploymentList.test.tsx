import React from 'react'
import { render, waitFor } from '@testing-library/react'
import routes from '@common/RouteDefinitions'
import { TestWrapper } from '@common/utils/testUtils'
import { defaultAppStoreValues } from '@common/utils/DefaultAppStoreData'
import { accountPathProps, pipelineModuleParams, pipelinePathProps } from '@common/utils/routeUtils'
import CDPipelineDeploymentList from '../CDPipelineDeploymentList'
import data from './response.json'
import filters from '../../../../70-pipeline/pages/pipeline-deployment-list/__tests__/filters.json'

jest.mock('@common/components/YAMLBuilder/YamlBuilder', () => ({ children }: { children: JSX.Element }) => (
  <div>{children}</div>
))

jest.mock('services/pipeline-ng', () => ({
  useGetListOfExecutions: jest.fn(() => ({
    mutate: jest.fn(() => Promise.resolve(data)),
    loading: false,
    cancel: jest.fn()
  })),
  useGetTemplateFromPipeline: jest.fn(() => ({ data: {} })),
  useGetPipeline: jest.fn(() => ({ data: {} })),
  useCreateInputSetForPipeline: jest.fn(() => ({ data: {} })),
  useGetMergeInputSetFromPipelineTemplateWithListInput: jest.fn(() => ({ data: {} })),
  useHandleInterrupt: jest.fn(() => ({})),
  usePostPipelineExecuteWithInputSetYaml: jest.fn(() => ({ data: {} })),
  useGetFilterList: jest.fn().mockImplementation(() => {
    return { mutate: jest.fn(() => Promise.resolve(filters)), loading: false }
  }),
  usePostFilter: jest.fn(() => ({
    mutate: jest.fn(),
    loading: false,
    cancel: jest.fn()
  })),
  useUpdateFilter: jest.fn(() => ({
    mutate: jest.fn(),
    loading: false,
    cancel: jest.fn()
  })),
  useDeleteFilter: jest.fn(() => ({
    mutate: jest.fn(),
    loading: false,
    cancel: jest.fn()
  }))
}))

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('<CDPipelineDeploymentList /> tests', () => {
  beforeAll(() => {
    jest.spyOn(global.Date, 'now').mockReturnValue(1603645966706)
  })
  afterAll(() => {
    jest.spyOn(global.Date, 'now').mockReset()
  })
  test('snapshot test', async () => {
    const { container, findByText } = render(
      <TestWrapper
        path={routes.toPipelineDeploymentList({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams })}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: 'pipeline',
          module: 'cd'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <CDPipelineDeploymentList />
      </TestWrapper>
    )

    await waitFor(() => findByText('http_pipeline', { selector: '.pipelineName' }))
    // await waitForElementToBeRemoved(() => findByText('Loading, please wait...'))

    expect(container).toMatchSnapshot()
  })
})
