import React from 'react'
import { useParams } from 'react-router-dom'
import { useModalHook } from '@wings-software/uikit'
import { Dialog } from '@blueprintjs/core'
import { getCDPipelineStages, stagesMap } from '@cd/components/CDPipelineStages/CDPipelineStages'
import factory from '@pipeline/components/PipelineSteps/PipelineStepFactory'
import { PipelineProvider, PipelineStudio } from '@pipeline/exports'
import { RunPipelineForm } from '@pipeline/components/RunPipelineModal/RunPipelineForm'
import { runPipelineDialogProps } from '@pipeline/components/RunPipelineModal/RunPipelineModal'
import {
  routeCDPipelineStudioYaml,
  routeCDPipelineStudio,
  routeCDPipelineStudioUI,
  routeCDDeployments,
  routeCDPipelines,
  routePipelineDetail
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
        routePipelineStudio={routeCDPipelineStudio}
        routePipelineStudioUI={routeCDPipelineStudioUI}
        routePipelineStudioYaml={routeCDPipelineStudioYaml}
        routePipelineProject={routeCDDeployments}
        routePipelineDetail={routePipelineDetail}
        routePipelineList={routeCDPipelines}
      >
        {children}
      </PipelineStudio>
    </PipelineProvider>
  )
}

export default CDPipelineStudio
