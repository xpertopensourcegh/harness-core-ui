import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useModalHook } from '@wings-software/uikit'
import { Dialog } from '@blueprintjs/core'
import { getCDPipelineStages, stagesMap } from '@cd/components/CDPipelineStages/CDPipelineStages'
import factory from '@pipeline/components/PipelineSteps/PipelineStepFactory'
import { DefaultNewPipelineId, PipelineProvider, PipelineStudio } from '@pipeline/exports'
import { RunPipelineForm } from '@pipeline/components/RunPipelineModal/RunPipelineForm'
import { runPipelineDialogProps } from '@pipeline/components/RunPipelineModal/RunPipelineModal'
import routes from '@common/RouteDefinitions'
import css from './CIPipelineStudio.module.scss'

const CIPipelineStudio: React.FC = ({ children }): JSX.Element => {
  const { accountId, projectIdentifier, orgIdentifier, pipelineIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
    pipelineIdentifier: string
  }>()
  const [isRunPipelineOpen, setRunPipelineOpen] = React.useState(true)

  const [openModel, hideModel] = useModalHook(
    () => (
      <Dialog isOpen={isRunPipelineOpen} {...runPipelineDialogProps}>
        <RunPipelineForm
          pipelineIdentifier={pipelineIdentifier}
          onClose={closeModel}
          orgIdentifier={orgIdentifier}
          projectIdentifier={projectIdentifier}
          accountId={accountId}
        />
      </Dialog>
    ),
    [pipelineIdentifier, projectIdentifier, accountId, orgIdentifier]
  )

  const closeModel = React.useCallback(() => {
    setRunPipelineOpen(false)
    hideModel()
  }, [hideModel])

  const handleRunPipeline = React.useCallback(async () => {
    openModel()
  }, [openModel])

  const history = useHistory()
  return (
    <PipelineProvider
      stagesMap={stagesMap}
      queryParams={{ accountIdentifier: accountId, orgIdentifier, projectIdentifier }}
      pipelineIdentifier={pipelineIdentifier}
      renderPipelineStage={getCDPipelineStages}
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
              routes.toCIPipelines({
                projectIdentifier,
                orgIdentifier,
                accountId
              })
            )
          }
        }}
        routePipelineStudio={routes.toCIPipelineStudio}
        routePipelineStudioUI={routes.toCIPipelineStudioUI}
        routePipelineStudioYaml={routes.toCIPipelineStudioYaml}
        routePipelineDetail={routes.toCIPipelineStudio}
        routePipelineProject={routes.toCIBuilds}
        routePipelineList={routes.toCIPipelines}
      >
        {children}
      </PipelineStudio>
    </PipelineProvider>
  )
}

export default CIPipelineStudio
