import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { getCDPipelineStages, stagesMap } from '@cd/components/CDPipelineStages/CDPipelineStages'
import factory from '@pipeline/components/PipelineSteps/PipelineStepFactory'
import { PipelineProvider, PipelineStudio } from '@pipeline/exports'

import routes from '@common/RouteDefinitions'
import type { AccountPathProps, PipelinePathProps, PipelineType } from '@common/interfaces/RouteInterfaces'
import { useAppStore } from 'framework/exports'
import css from './CDPipelineStudio.module.scss'

const CDPipelineStudio: React.FC = (): JSX.Element => {
  const { accountId, projectIdentifier, orgIdentifier, pipelineIdentifier, module } = useParams<
    PipelineType<PipelinePathProps & AccountPathProps>
  >()

  const history = useHistory()
  const handleRunPipeline = (): void => {
    history.push(
      routes.toRunPipeline({
        accountId,
        orgIdentifier,
        projectIdentifier,
        pipelineIdentifier,
        module
      })
    )
  }
  const { selectedProject } = useAppStore()

  return (
    <PipelineProvider
      stagesMap={stagesMap}
      queryParams={{ accountIdentifier: accountId, orgIdentifier, projectIdentifier }}
      pipelineIdentifier={pipelineIdentifier}
      renderPipelineStage={args =>
        getCDPipelineStages(args, selectedProject?.modules && selectedProject.modules.indexOf?.('CI') > -1, true)
      }
      stepsFactory={factory}
      runPipeline={handleRunPipeline}
    >
      <PipelineStudio
        className={css.container}
        routePipelineStudio={routes.toPipelineStudio}
        routePipelineProject={routes.toDeployments}
        routePipelineDetail={routes.toPipelineDetail}
        routePipelineList={routes.toPipelines}
      ></PipelineStudio>
    </PipelineProvider>
  )
}

export default CDPipelineStudio
