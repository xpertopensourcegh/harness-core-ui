import React from 'react'
import { useParams } from 'react-router-dom'
import { useModalHook } from '@wings-software/uikit'
import { Dialog } from '@blueprintjs/core'

import PipelineDeploymentList from '@pipeline/pages/pipeline-deployment-list/PipelineDeploymentList'
import { runPipelineDialogProps } from '@pipeline/components/RunPipelineModal/RunPipelineModal'
import { RunPipelineForm } from '@pipeline/components/RunPipelineModal/RunPipelineForm'
import type { PipelinePathProps, AccountPathProps } from '@common/interfaces/RouteInterfaces'

export default function CIPipelineDeploymentList(): React.ReactElement {
  const { pipelineIdentifier, orgIdentifier, projectIdentifier, accountId } = useParams<
    PipelinePathProps & AccountPathProps
  >()

  const [openModal, hideModal] = useModalHook(
    () => (
      <Dialog isOpen={true} {...runPipelineDialogProps}>
        <RunPipelineForm
          pipelineIdentifier={pipelineIdentifier}
          onClose={hideModal}
          orgIdentifier={orgIdentifier}
          projectIdentifier={projectIdentifier}
          accountId={accountId}
        />
      </Dialog>
    ),
    [pipelineIdentifier, orgIdentifier, projectIdentifier, accountId]
  )

  return <PipelineDeploymentList onRunPipeline={openModal} />
}
