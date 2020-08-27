import React from 'react'
import cx from 'classnames'
import { Icon, Button } from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import { useToaster } from 'modules/common/exports'
import { usePostPipelineExecute } from 'services/cd-ng'
import i18n from './RightBar.i18n'
import { PipelineContext } from '../PipelineContext/PipelineContext'
import { DrawerTypes } from '../PipelineContext/PipelineActions'
import css from './RightBar.module.scss'

export const RightBar = (): JSX.Element => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()

  const { showSuccess, showWarning } = useToaster()
  const {
    state: {
      isUpdated,
      pipeline,
      pipelineView,
      pipelineView: {
        drawerData: { type }
      }
    },
    updatePipelineView
  } = React.useContext(PipelineContext)

  const { mutate: runPipeline } = usePostPipelineExecute({
    queryParams: { accountIdentifier: accountId, projectIdentifier, orgIdentifier },
    identifier: pipeline.identifier || ''
  })

  const handleRunPipeline = React.useCallback(async () => {
    if (!isUpdated) {
      updatePipelineView({
        ...pipelineView,
        isDrawerOpened: false
      })
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
      <Button
        noStyling
        className={cx(css.iconButton, { [css.selected]: type === DrawerTypes.Templates })}
        onClick={() =>
          updatePipelineView({
            ...pipelineView,
            isDrawerOpened: true,
            drawerData: { type: DrawerTypes.Templates, size: 700 }
          })
        }
      >
        <Icon name="template-library" title={i18n.templateLibrary} size={type === DrawerTypes.Templates ? 22 : 16} />
      </Button>
      <Button
        noStyling
        className={cx(css.iconButton, { [css.selected]: type === DrawerTypes.PipelineVariables })}
        onClick={() =>
          updatePipelineView({
            ...pipelineView,
            isDrawerOpened: true,
            drawerData: { type: DrawerTypes.PipelineVariables, size: 1335, hasBackdrop: true }
          })
        }
      >
        <Icon
          name="pipeline-variables"
          size={type === DrawerTypes.PipelineVariables ? 26 : 16}
          title={i18n.inputVariables}
        />
      </Button>
      <Button noStyling className={css.iconButton} onClick={handleRunPipeline}>
        <Icon name="run-pipeline" title={i18n.runPipeline} />
      </Button>
      <div />
    </div>
  )
}
