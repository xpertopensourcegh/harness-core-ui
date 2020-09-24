import { Dialog, IDialogProps } from '@blueprintjs/core'
import { useModalHook } from '@wings-software/uikit'
import React from 'react'
import type { InputSetSelectorProps } from '../InputSetSelector/InputSetSelector'
import { RunPipelineForm } from './RunPipelineForm'

export interface RunPipelineModalProps {
  children: React.ReactNode
  pipelineIdentifier: string
  inputSetSelected?: InputSetSelectorProps['value']
  className?: string
}

const dialogProps: Omit<IDialogProps, 'isOpen'> = {
  usePortal: true,
  autoFocus: true,
  canEscapeKeyClose: true,
  canOutsideClickClose: true,
  enforceFocus: true,
  style: { minWidth: 700, minHeight: 210 }
}

export const RunPipelineModal: React.FC<RunPipelineModalProps> = ({
  children,
  inputSetSelected,
  pipelineIdentifier,
  className = ''
}): JSX.Element => {
  const [isOpen, setIsOpen] = React.useState(true)

  const [openModel, hideModel] = useModalHook(
    () => (
      <Dialog isOpen={isOpen} {...dialogProps}>
        <RunPipelineForm
          pipelineIdentifier={pipelineIdentifier}
          inputSetSelected={inputSetSelected}
          onClose={closeModel}
        />
      </Dialog>
    ),
    [inputSetSelected, pipelineIdentifier]
  )

  const closeModel = React.useCallback(() => {
    setIsOpen(false)
    hideModel()
  }, [hideModel])
  return (
    <span
      className={className}
      onClick={() => {
        setIsOpen(true)
        openModel()
      }}
    >
      {children}
    </span>
  )
}
