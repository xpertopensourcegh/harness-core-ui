import React from 'react'
import { useModalHook } from '@wings-software/uikit'
import { Dialog } from '@blueprintjs/core'
import { ExecutionsListingView } from '@pipeline/components/ExecutionsListingView/ExecutionsListingView'
import { useRouteParams } from 'framework/exports'
import { runPipelineDialogProps } from '@pipeline/components/RunPipelineModal/RunPipelineModal'
import { RunPipelineForm } from '@pipeline/components/RunPipelineModal/RunPipelineForm'

const PipelineDeploymentList: React.FC = () => {
  const { params } = useRouteParams()
  const [isRunPipelineOpen, setRunPipelineOpen] = React.useState(true)

  const [openModel, hideModel] = useModalHook(
    () => (
      <Dialog isOpen={isRunPipelineOpen} {...runPipelineDialogProps}>
        <RunPipelineForm pipelineIdentifier={params.pipelineIdentifier as string} onClose={closeModel} />
      </Dialog>
    ),
    [params.pipelineIdentifier]
  )

  const closeModel = React.useCallback(() => {
    setRunPipelineOpen(false)
    hideModel()
  }, [hideModel])
  return (
    <ExecutionsListingView onNoDataButtonClick={openModel} pipelineIdentifier={params.pipelineIdentifier as string} />
  )
}

export default PipelineDeploymentList
