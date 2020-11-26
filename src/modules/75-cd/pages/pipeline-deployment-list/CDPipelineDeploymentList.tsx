import React from 'react'
import { useParams } from 'react-router-dom'
import { useModalHook } from '@wings-software/uikit'
import { Dialog } from '@blueprintjs/core'

import PipelineDeploymentList from '@pipeline/pages/pipeline-deployment-list/PipelineDeploymentList'
import { runPipelineDialogProps } from '@pipeline/components/RunPipelineModal/RunPipelineModal'
import { RunPipelineForm } from '@pipeline/components/RunPipelineModal/RunPipelineForm'

export default function CDPipelineDeploymentList(): React.ReactElement {
  const { pipelineIdentifier } = useParams()

  const [openModal, hideModal] = useModalHook(
    () => (
      <Dialog isOpen={true} {...runPipelineDialogProps}>
        <RunPipelineForm pipelineIdentifier={pipelineIdentifier} onClose={hideModal} />
      </Dialog>
    ),
    [pipelineIdentifier]
  )
  return <PipelineDeploymentList onRunPipeline={openModal} />
}
