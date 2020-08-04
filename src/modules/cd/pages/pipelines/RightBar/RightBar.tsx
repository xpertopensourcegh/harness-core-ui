import React from 'react'
import { Icon } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import { useToaster } from 'modules/common/exports'
import { usePostPipelineExecute } from 'services/cd-ng'
import i18n from './RightBar.i18n'
import { PipelineContext } from '../PipelineContext/PipelineContext'
import css from './RightBar.module.scss'

export const RightBar = (): JSX.Element => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()

  const { showSuccess, showWarning } = useToaster()
  const {
    state: { isUpdated, pipeline }
  } = React.useContext(PipelineContext)

  const { mutate: runPipeline } = usePostPipelineExecute({
    queryParams: { accountIdentifier: accountId, projectIdentifier, orgIdentifier },
    identifier: pipeline.identifier || ''
  })

  const handleRunPipeline = React.useCallback(async () => {
    if (!isUpdated) {
      const response = await runPipeline()
      if (response.status === 'SUCCESS') {
        showSuccess(i18n.pipelineSave)
      }
    } else {
      showWarning(i18n.pipelineUnSave)
    }
  }, [runPipeline, isUpdated, showWarning, showSuccess])

  return (
    <div className={css.rightBar}>
      <div />
      <Icon name="template-library" title={i18n.templateLibrary} />
      <Icon name="pipeline-variables" title={i18n.inputVariables} />
      <Icon name="run-pipeline" title={i18n.runPipeline} onClick={handleRunPipeline} />
      <div />
    </div>
  )
}
