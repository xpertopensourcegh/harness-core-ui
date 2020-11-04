import React from 'react'
import { render, waitFor, getByText as getByTextBody, fireEvent, RenderResult } from '@testing-library/react'
import { prependAccountPath, TestWrapper } from '@common/utils/testUtils'
import { defaultAppStoreValues } from '@projects-orgs/pages/projects/__tests__/DefaultAppStoreData'
import { routeCDPipelineStudio } from 'navigation/cd/routes'
import CDPipelineStudio from '@cd/pages/pipeline-studio/CDPipelineStudio'
import StageBuilder from '@pipeline/components/PipelineStudio/StageBuilder/StageBuilder'
import {
  PipelineResponse,
  StepsResponse,
  ExecutionResponse,
  YamlResponse
} from '@pipeline/components/PipelineStudio/__tests__/PipelineStudioMocks'
jest.mock('@common/components/YAMLBuilder/YamlBuilder', () => ({ children }: { children: JSX.Element }) => (
  <div>{children}</div>
))

window.HTMLElement.prototype.scrollTo = jest.fn()

jest.mock('services/cd-ng', () => ({
  getPipelinePromise: jest.fn().mockImplementation(() => Promise.resolve(PipelineResponse)),
  useGetConnector: jest.fn().mockImplementation(() => ({ loading: false, refetch: jest.fn(), data: undefined })),
  useGetSteps: jest.fn().mockImplementation(() => ({ loading: false, refetch: jest.fn(), data: StepsResponse })),
  useGetExecutionStrategyList: jest.fn().mockImplementation(() => ({ loading: false, data: ExecutionResponse })),
  useGetExecutionStrategyYaml: jest.fn().mockImplementation(() => ({ loading: false, data: YamlResponse }))
}))

jest.mock('resize-observer-polyfill', () => {
  class ResizeObserver {
    static default = ResizeObserver
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    observe() {
      // do nothing
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    unobserve() {
      // do nothing
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    disconnect() {
      // do nothing
    }
  }
  return ResizeObserver
})

describe('Stage Builder Test', () => {
  let stageBuilder: HTMLElement
  let getByTextContainer: RenderResult['getByText']
  beforeEach(async () => {
    const { container, getByText } = render(
      <TestWrapper
        path={prependAccountPath(routeCDPipelineStudio.path)}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: 'editPipeline'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <CDPipelineStudio>
          <StageBuilder />
        </CDPipelineStudio>
      </TestWrapper>
    )
    await waitFor(() => getByText('asd'))
    stageBuilder = container
    getByTextContainer = getByText
  })

  test('should test stage builder and perform new stage addition', async () => {
    // Click Create New Stage
    const createNewBtn = stageBuilder.querySelector('.defaultCard.createNew')
    fireEvent.click(createNewBtn as HTMLElement)
    await waitFor(() => getByTextBody(document.body, 'Deploy'))
    const deployBtn = getByTextBody(document.body, 'Deploy')
    // Select Deploy
    fireEvent.click(deployBtn)
    await waitFor(() => getByTextContainer('Untitled'))
    const newStage = getByTextContainer('Untitled')
    // Select new Stage
    fireEvent.click(newStage)
    await waitFor(() => getByTextBody(document.body, 'About Your Stage'))
    const stageName = document.body.querySelector('[name="name"]')
    // Enter Stage Name
    fireEvent.change(stageName!, { target: { value: 'New Stage' } })
    await waitFor(() => getByTextBody(document.body, 'New_Stage'))
    const setupStage = getByTextBody(document.body, 'Setup Stage')
    // Click Setup
    fireEvent.click(setupStage)
    await waitFor(() => getByTextBody(document.body, 'Propagate From:'))
    let next = getByTextContainer('Next')
    // Click Next to go to Infra
    fireEvent.click(next)
    await waitFor(() => getByTextBody(document.body, 'Name your environment'))
    // Click Next to go to Execution Tab
    next = getByTextContainer('Next')
    fireEvent.click(next)
    await waitFor(() => expect(stageBuilder.querySelector('.bp3-tab-panel [icon="plus"]')).toBeDefined())
  }, 20000)

  test('should test stage builder and perform edit an stage', async () => {
    // Select an Existing Stage
    const stage = getByTextContainer('asd')
    fireEvent.click(stage)
    await waitFor(() => getByTextContainer('Name of your service'))

    let next = getByTextContainer('Next')
    // Click Next to go to Infra
    fireEvent.click(next)
    await waitFor(() => getByTextContainer('Name your environment'))
    // Click Next to go to Execution Tab
    next = getByTextContainer('Next')
    fireEvent.click(next)
    await waitFor(() => expect(stageBuilder.querySelector('.bp3-tab-panel [icon="plus"]')).toBeDefined())
    // Click New Step
    const newStep = stageBuilder.querySelector('.bp3-tab-panel [icon="plus"]')
    fireEvent.click(newStep as HTMLElement)
    await waitFor(() => getByTextBody(document.body, 'Add Step'))
    // Select Add Step
    const addStep = getByTextBody(document.body, 'Add Step')
    fireEvent.click(addStep)
    await waitFor(() => getByTextBody(document.body, 'Drag a step to the canvas'))
    // Select the ShellScript Step
    const shellScriptAddStep = getByTextBody(document.body, 'Shell Script')
    fireEvent.click(shellScriptAddStep)
    await waitFor(() => getByTextContainer('Shell Script'))
    // Configure Shell Script Step
    const shellScriptStep = getByTextContainer('Shell Script')
    fireEvent.click(shellScriptStep)
    await waitFor(() => getByTextBody(document.body, 'Step Configuration'))
    // Enter name in shell script step
    const nameField = document.body.querySelector('#bp3-tab-panel_step-commands_step-configuration [name="name"]')
    fireEvent.change(nameField as HTMLElement, { target: { value: 'Test Shell Script' } })
    // Now Submit the configuration
    const submitBtn = document.body.querySelector('#bp3-tab-panel_step-commands_step-configuration button')
    fireEvent.click(submitBtn!)
    await waitFor(() => getByTextContainer('Test Shell Script'))
    // Save the Execution Step
    const saveBtn = getByTextContainer('Save')
    fireEvent.click(saveBtn)
    await waitFor(() => expect(stageBuilder.querySelector('.SplitPane')).toBeNull())
  }, 20000)

  test('should test stage builder group stage', async () => {
    // Select an Existing Stage
    const stage = getByTextContainer('asd')
    fireEvent.click(stage)
    await waitFor(() => getByTextContainer('Name of your service'))
    const stageDecrease = stageBuilder.querySelector('.stageDecrease')
    fireEvent.click(stageDecrease!)
    await waitFor(() => getByTextContainer('asd, test1'))
    const groupStage = getByTextContainer('asd, test1')
    fireEvent.click(groupStage)
    await waitFor(() => getByTextBody(document.body, 'test1'))
    const newStage = getByTextBody(document.body, 'test1')
    fireEvent.click(newStage)
    await waitFor(() =>
      getByTextBody(document.body.querySelector('.serviceStageSelection') as HTMLElement, 'Propagate From:')
    )
    const stageIncrease = stageBuilder.querySelector('.stageIncrease')
    fireEvent.click(stageIncrease!)
    fireEvent.click(stageIncrease!)
    await waitFor(() => expect(stageBuilder.querySelector('.iconGroup')).toBeNull())
  }, 20000)

  test('should test remove stage', async () => {
    // Hover node
    const stage = getByTextContainer('asd')
    fireEvent.mouseOver(stage)
    await waitFor(() => expect(stage.parentElement?.querySelector('[icon="cross"]')).toBeDefined())
    const removeBtn = stage.parentElement?.querySelector('[icon="cross"]')
    fireEvent.click(removeBtn as HTMLElement)
  }, 10000)

  test('should test stage builder and perform select Execution Strategy', async () => {
    // Click Create New Stage
    const createNewBtn = stageBuilder.querySelector('.defaultCard.createNew')
    fireEvent.click(createNewBtn as HTMLElement)
    await waitFor(() => getByTextBody(document.body, 'Deploy'))
    const deployBtn = getByTextBody(document.body, 'Deploy')
    // Select Deploy
    fireEvent.click(deployBtn)
    await waitFor(() => getByTextContainer('Untitled'))
    const newStage = getByTextContainer('Untitled')
    // Select new Stage
    fireEvent.click(newStage)
    await waitFor(() => getByTextBody(document.body, 'About Your Stage'))
    const stageName = document.body.querySelector('[name="name"]')
    // Enter Stage Name
    fireEvent.change(stageName!, { target: { value: 'New Stage' } })
    await waitFor(() => expect(getByTextBody(document.body, 'New_Stage')).toBeDefined())
    const setupStage = getByTextBody(document.body, 'Setup Stage')
    // Click Setup
    fireEvent.click(setupStage)
    await waitFor(() => getByTextContainer('Deploy different service'))
    const deployService = getByTextContainer('Deploy different service')
    // Click Next to go to Deploy Service
    fireEvent.click(deployService)
    await waitFor(() => getByTextContainer('Name of your service'))
    // Click Next to go to Execution Tab
    const executionTab = getByTextContainer('Execution')
    fireEvent.click(executionTab)
    await waitFor(() => expect(getByTextBody(document.body, 'Execution Strategy')).toBeDefined())
    // Select Execution Strategy
    const selectStrategy = getByTextBody(document.body, 'Select Strategy')
    fireEvent.click(selectStrategy)
  }, 20000)
})
