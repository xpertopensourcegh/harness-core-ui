import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { getCDPipelineStages, stagesMap } from '@cd/components/CDPipelineStages/CDPipelineStages'
import factory from '@pipeline/components/PipelineSteps/PipelineStepFactory'
import { DefaultNewPipelineId, PipelineProvider, PipelineStudio } from '@pipeline/exports'
import routes from '@common/RouteDefinitions'
import type { AccountPathProps, PipelinePathProps, PipelineType } from '@common/interfaces/RouteInterfaces'
import { useAppStore, useStrings } from 'framework/exports'
import css from './CIPipelineStudio.module.scss'

const CIPipelineStudio: React.FC = (): JSX.Element => {
  const { accountId, projectIdentifier, orgIdentifier, pipelineIdentifier, module } = useParams<
    PipelineType<PipelinePathProps & AccountPathProps>
  >()
  const { getString } = useStrings()
  const { selectedProject } = useAppStore()
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
  return (
    <PipelineProvider
      stagesMap={stagesMap}
      queryParams={{ accountIdentifier: accountId, orgIdentifier, projectIdentifier }}
      pipelineIdentifier={pipelineIdentifier}
      renderPipelineStage={args =>
        getCDPipelineStages(
          args,
          getString,
          true,
          selectedProject?.modules && selectedProject.modules.indexOf?.('CD') > -1
        )
      }
      stepsFactory={factory}
      runPipeline={handleRunPipeline}
    >
      <PipelineStudio
        className={css.container}
        onClose={() => {
          if (pipelineIdentifier !== DefaultNewPipelineId) {
            history.push(
              routes.toCIPipelineDeploymentList({
                projectIdentifier,
                orgIdentifier,
                pipelineIdentifier,
                accountId
              })
            )
          } else {
            history.push(
              routes.toPipelines({
                projectIdentifier,
                orgIdentifier,
                accountId,
                module
              })
            )
          }
        }}
        routePipelineStudio={routes.toPipelineStudio}
        routePipelineDetail={routes.toPipelineDetail}
        routePipelineProject={routes.toDeployments}
        routePipelineList={routes.toPipelines}
      ></PipelineStudio>
    </PipelineProvider>
  )
}

export default CIPipelineStudio
