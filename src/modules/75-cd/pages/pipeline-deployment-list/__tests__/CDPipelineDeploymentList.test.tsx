import React from 'react'
import { render } from '@testing-library/react'
import routes from '@common/RouteDefinitions'
import { TestWrapper } from '@common/utils/testUtils'
import { defaultAppStoreValues } from '@projects-orgs/pages/projects/__tests__/DefaultAppStoreData'
import { accountPathProps, pipelineModuleParams, pipelinePathProps } from '@common/utils/routeUtils'
import CDPipelineDeploymentList from '../CDPipelineDeploymentList'

jest.mock('@common/components/YAMLBuilder/YamlBuilder', () => ({ children }: { children: JSX.Element }) => (
  <div>{children}</div>
))

jest.mock('services/pipeline-ng', () => ({
  useGetListOfExecutions: jest.fn(() => ({ data: { data: { content: [] } } })),
  useGetTemplateFromPipeline: jest.fn(() => ({ data: {} })),
  useGetPipeline: jest.fn(() => ({ data: {} })),
  useCreateInputSetForPipeline: jest.fn(() => ({ data: {} })),
  useGetMergeInputSetFromPipelineTemplateWithListInput: jest.fn(() => ({ data: {} })),
  useHandleInterrupt: jest.fn(() => ({})),
  usePostPipelineExecuteWithInputSetYaml: jest.fn(() => ({ data: {} }))
}))

describe('<CDPipelineDeploymentList /> tests', () => {
  beforeAll(() => {
    jest.spyOn(global.Date, 'now').mockReturnValue(1603645966706)
  })
  afterAll(() => {
    jest.spyOn(global.Date, 'now').mockReset()
  })
  test('snapshot test', () => {
    const { container } = render(
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
    expect(container).toMatchSnapshot()
  })
})
