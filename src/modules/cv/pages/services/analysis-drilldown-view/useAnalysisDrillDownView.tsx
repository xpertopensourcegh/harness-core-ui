import { Dialog, IDialogProps } from '@blueprintjs/core'
import { useModalHook } from '@wings-software/uikit'
import React, { useState } from 'react'
import { AnalysisDrillDownView, AnalysisDrillDownViewProps } from './AnalysisDrillDownView'
import css from './useAnalysisDrillDownView.module.scss'

const bpDialogProps: IDialogProps = {
  isOpen: true,
  usePortal: true,
  autoFocus: true,
  canEscapeKeyClose: true,
  canOutsideClickClose: true,
  enforceFocus: true,
  title: '',
  className: css.main,
  style: { width: 900, height: 570 }
}

type UseAnalysisDrillDownViewReturnType = {
  openDrillDown: (info: AnalysisDrillDownViewProps) => void
  closeDrillDown: () => void
}

export default function useAnalysisDrillDownView(
  drillDownInfo?: AnalysisDrillDownViewProps
): UseAnalysisDrillDownViewReturnType {
  const [drillDownProps, setDrillDownProps] = useState(drillDownInfo)
  const [openModal, hideModal] = useModalHook(
    () =>
      drillDownProps ? (
        <Dialog {...bpDialogProps} isOpen={true} onClose={hideModal}>
          <AnalysisDrillDownView {...drillDownProps} />
        </Dialog>
      ) : null,
    [drillDownProps]
  )

  return {
    openDrillDown: (updatedInfo: AnalysisDrillDownViewProps) => {
      setDrillDownProps(updatedInfo)
      openModal()
    },
    closeDrillDown: hideModal
  }
}
