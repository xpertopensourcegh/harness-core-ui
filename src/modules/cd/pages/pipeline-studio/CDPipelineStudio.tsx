import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useModalHook } from '@wings-software/uikit'
import { Dialog } from '@blueprintjs/core'
import { getCDPipelineStages, stagesMap } from 'modules/cd/components/CDPipelineStages/CDPipelineStages'
import factory from 'modules/cd/components/PipelineSteps/PipelineStepFactory'
import { DefaultNewPipelineId, PipelineProvider, PipelineStudio } from '@pipeline/exports'
import { RunPipelineForm } from 'modules/cd/components/RunPipelineModal/RunPipelineForm'
import { runPipelineDialogProps } from 'modules/cd/components/RunPipelineModal/RunPipelineModal'
import {
  routeCDPipelines,
  routePipelineDeploymentList,
  routeCDPipelineStudioYaml,
  routeCDPipelineStudio,
  routeCDPipelineStudioUI
} from 'navigation/cd/routes'
import css from './CDPipelineStudio.module.scss'

const CDPipelineStudio: React.FC = ({ children }): JSX.Element => {
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
        <RunPipelineForm pipelineIdentifier={pipelineIdentifier} onClose={closeModel} />
      </Dialog>
    ),
    [pipelineIdentifier]
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
              routePipelineDeploymentList.url({
                projectIdentifier,
                orgIdentifier,
                pipelineIdentifier
              })
            )
          } else {
            history.push(
              routeCDPipelines.url({
                projectIdentifier,
                orgIdentifier
              })
            )
          }
        }}
        routePipelineStudio={routeCDPipelineStudio}
        routePipelineStudioUI={routeCDPipelineStudioUI}
        routePipelineStudioYaml={routeCDPipelineStudioYaml}
      >
        {children}
      </PipelineStudio>
    </PipelineProvider>
  )
}

export default CDPipelineStudio
