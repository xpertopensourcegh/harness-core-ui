import React from 'react'
import cx from 'classnames'
import { Icon, Button } from '@wings-software/uicore'
import { useToaster } from '@common/exports'
import i18n from './RightBar.i18n'
import { PipelineContext } from '../PipelineContext/PipelineContext'
import { DrawerTypes } from '../PipelineContext/PipelineActions'
import css from './RightBar.module.scss'

export const RightBar = (): JSX.Element => {
  const { showWarning } = useToaster()
  const {
    state: {
      isUpdated,
      pipeline,
      pipelineView,
      pipelineView: {
        drawerData: { type }
      }
    },
    runPipeline,
    updatePipelineView
  } = React.useContext(PipelineContext)

  const handleRunPipeline = React.useCallback(async () => {
    if (!isUpdated) {
      runPipeline(pipeline.identifier)
    } else {
      showWarning(i18n.pipelineUnSave)
    }
  }, [runPipeline, isUpdated, showWarning, pipeline.identifier])

  return (
    <div className={css.rightBar}>
      <div />

      <Button
        noStyling
        disabled
        className={cx(css.iconButton, { [css.selected]: type === DrawerTypes.Templates })}
        onClick={() =>
          updatePipelineView({
            ...pipelineView,
            isDrawerOpened: true,
            drawerData: { type: DrawerTypes.Templates, size: 700 }
          })
        }
        tooltip={i18n.templateLibrary}
        tooltipProps={{ isDark: true, position: 'left' }}
      >
        <Icon name="template-library" size={type === DrawerTypes.Templates ? 22 : 16} />
      </Button>

      <Button
        noStyling
        className={cx(css.iconButton, { [css.selected]: type === DrawerTypes.PipelineVariables })}
        onClick={() =>
          updatePipelineView({
            ...pipelineView,
            isDrawerOpened: true,
            drawerData: { type: DrawerTypes.PipelineVariables, size: 1140, hasBackdrop: true },
            isSplitViewOpen: false,
            splitViewData: {}
          })
        }
        tooltip={i18n.inputVariables}
        tooltipProps={{ isDark: true, position: 'left' }}
        data-testid="input-variable"
      >
        <Icon name="pipeline-variables" size={type === DrawerTypes.PipelineVariables ? 26 : 16} />
      </Button>

      <Button
        noStyling
        className={css.iconButton}
        onClick={handleRunPipeline}
        tooltip={i18n.runPipeline}
        tooltipProps={{ isDark: true, position: 'left' }}
        data-testid="run-pipeline"
      >
        <Icon name="run-pipeline" />
      </Button>

      <div />
    </div>
  )
}
