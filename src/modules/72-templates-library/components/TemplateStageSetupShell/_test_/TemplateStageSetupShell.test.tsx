import React from 'react'
import { render } from '@testing-library/react'
import { set } from 'lodash-es'
import produce from 'immer'
import routes from '@common/RouteDefinitions'
import { accountPathProps, pipelineModuleParams, pipelinePathProps } from '@common/utils/routeUtils'
import { PipelineContext } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import pipelineContextMock from '@pipeline/components/PipelineStudio/RightDrawer/__tests__/stateMock'
import { findDialogContainer, TestWrapper } from '@common/utils/testUtils'
import { DefaultNewStageName } from '@templates-library/components/TemplateStudio/StageTemplateCanvas/StageTemplateForm/StageTemplateForm'
import TemplateStageSetupShell from '@templates-library/components/TemplateStageSetupShell/TemplateStageSetupShell'
import { generateRandomString } from '@pipeline/components/PipelineStudio/ExecutionGraph/ExecutionGraphUtil'

jest.mock('@templates-library/components/TemplateStageSpecifications/TemplateStageSpecifications', () => ({
  ...(jest.requireActual(
    '@templates-library/components/TemplateStageSpecifications/TemplateStageSpecifications'
  ) as any),
  TemplateStageSpecifications: () => {
    return <div className="template-stage-specifications" />
  }
}))

describe('<TemplateStageSetupShell /> tests', () => {
  test('snapshot test', async () => {
    const templateStage = {
      name: DefaultNewStageName,
      identifier: generateRandomString('templateRef')
    }
    const context = produce(pipelineContextMock, draft => {
      delete draft.state.pipeline.stages
      set(draft, 'state.pipeline.stages[0].stage', templateStage)
      set(draft, 'state.selectionState', {
        selectedStageId: templateStage.identifier
      })
      draft.getStageFromPipeline = jest.fn().mockReturnValue({
        stage: {
          stage: templateStage
        }
      })
    })
    const { container } = render(
      <PipelineContext.Provider value={context}>
        <TestWrapper
          path={routes.toPipelineStudio({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams })}
          pathParams={{
            pipelineIdentifier: 'stage1',
            accountId: 'accountId',
            projectIdentifier: 'Milos2',
            orgIdentifier: 'CV',
            module: 'cd'
          }}
        >
          <TemplateStageSetupShell />
        </TestWrapper>
      </PipelineContext.Provider>
    )
    expect(container).toMatchSnapshot()
    expect(findDialogContainer()).toBeTruthy()
  })
})
