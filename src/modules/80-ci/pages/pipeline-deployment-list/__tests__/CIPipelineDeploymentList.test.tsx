import React from 'react'
import { render } from '@testing-library/react'
import routes from '@common/RouteDefinitions'
import { TestWrapper } from '@common/utils/testUtils'
import { defaultAppStoreValues } from '@projects-orgs/pages/projects/__tests__/DefaultAppStoreData'
import { accountPathProps, pipelinePathProps } from '@common/utils/routeUtils'
import CIPipelineDeploymentList from '../CIPipelineDeploymentList'

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

describe('<CIPipelineDeploymentList /> tests', () => {
  beforeAll(() => {
    jest.spyOn(global.Date, 'now').mockReturnValue(1603645966706)
  })
  afterAll(() => {
    jest.spyOn(global.Date, 'now').mockReset()
  })
  test('snapshot test', () => {
    const { container } = render(
      <TestWrapper
        path={routes.toCIPipelineDeploymentList({ ...accountPathProps, ...pipelinePathProps })}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: 'pipeline'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <CIPipelineDeploymentList />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
