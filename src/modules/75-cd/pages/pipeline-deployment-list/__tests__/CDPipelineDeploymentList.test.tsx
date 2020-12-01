import React from 'react'
import { render, act, fireEvent, findByText as findByTextGlobal } from '@testing-library/react'
import routes from '@common/RouteDefinitions'
import { TestWrapper } from '@common/utils/testUtils'
import { defaultAppStoreValues } from '@projects-orgs/pages/projects/__tests__/DefaultAppStoreData'
import { accountPathProps, pipelinePathProps } from '@common/utils/routeUtils'
import CDPipelineDeploymentList from '../CDPipelineDeploymentList'

jest.mock('@common/components/YAMLBuilder/YamlBuilder', () => ({ children }: { children: JSX.Element }) => (
  <div>{children}</div>
))

jest.mock('services/cd-ng', () => ({
  useGetListOfExecutions: jest.fn(() => ({ data: { data: { content: [] } } })),
  useHandleInterrupt: jest.fn(() => ({})),
  useGetTemplateFromPipeline: jest.fn(() => ({ data: {} })),
  useGetPipeline: jest.fn(() => ({ data: {} })),
  usePostPipelineExecuteWithInputSetYaml: jest.fn(() => ({ data: {} })),
  useGetMergeInputSetFromPipelineTemplateWithListInput: jest.fn(() => ({ data: {} })),
  useCreateInputSetForPipeline: jest.fn(() => ({ data: {} }))
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
        path={routes.toCDPipelineDeploymentList({ ...accountPathProps, ...pipelinePathProps })}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: 'pipeline'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <CDPipelineDeploymentList />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('opens run pipelie modal', async () => {
    const { findByText } = render(
      <TestWrapper
        path={routes.toCDPipelineDeploymentList({ ...accountPathProps, ...pipelinePathProps })}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: 'pipeline'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <CDPipelineDeploymentList />
      </TestWrapper>
    )

    const run = await findByText('Run Pipeline')

    act(() => {
      fireEvent.click(run)
    })

    const btnText = await findByTextGlobal(document.querySelector('.bp3-dialog') as HTMLElement, 'Run Pipeline', {
      selector: '.bp3-button-text'
    })

    expect(btnText).toBeDefined()
  })
})
