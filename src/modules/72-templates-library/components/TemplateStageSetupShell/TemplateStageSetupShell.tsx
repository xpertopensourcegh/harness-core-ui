import React, { useEffect } from 'react'
import cx from 'classnames'
import { useModalHook } from '@wings-software/uicore'
import { Classes, Dialog } from '@blueprintjs/core'
import { defaultTo } from 'lodash-es'
import { usePipelineContext } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import { TemplateStageSpecifications } from '@templates-library/components/TemplateStageSpecifications/TemplateStageSpecifications'
import { isCustomGeneratedString } from '@pipeline/components/PipelineStudio/ExecutionGraph/ExecutionGraphUtil'
import { NameIdModal } from '@pipeline/components/NameIdModal/NameIdModal'
import css from './TemplateStageSetupShell.module.scss'

export default function TemplateStageSetupShell(): JSX.Element {
  const pipelineContext = usePipelineContext()
  const {
    state: {
      selectionState: { selectedStageId = '' }
    },
    getStageFromPipeline
  } = pipelineContext
  const { stage } = getStageFromPipeline(selectedStageId)

  const [showNameIdModal, hideNameIdModal] = useModalHook(
    () => (
      <Dialog enforceFocus={false} isOpen className={cx(Classes.DIALOG, css.templateNameDialog)}>
        <NameIdModal onClose={hideNameIdModal} context={pipelineContext} />
      </Dialog>
    ),
    [pipelineContext]
  )

  useEffect(() => {
    if (isCustomGeneratedString(defaultTo(stage?.stage?.identifier, ''))) {
      showNameIdModal()
    }
  }, [stage?.stage])

  return (
    <section key={selectedStageId} className={cx(css.setupShell)}>
      <TemplateStageSpecifications />
    </section>
  )
}
