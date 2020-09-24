import { Dialog, IDialogProps } from '@blueprintjs/core'
import { useModalHook } from '@wings-software/uikit'
import React from 'react'
import type { InputSetSelectorProps } from '../InputSetSelector/InputSetSelector'
import { RunPipelineForm } from './RunPipelineForm'

export interface RunPipelineModalProps {
  children: React.ReactNode
  pipelineIdentifier: string
  inputSetOption?: InputSetSelectorProps['value']
  className?: string
}

const dialogProps: Omit<IDialogProps, 'isOpen'> = {
  usePortal: true,
  autoFocus: true,
  canEscapeKeyClose: true,
  canOutsideClickClose: true,
  enforceFocus: true,
  style: { width: 700, height: 600 }
}

export const RunPipelineModal: React.FC<RunPipelineModalProps> = ({
  children,
  inputSetOption,
  pipelineIdentifier,
  className = ''
}): JSX.Element => {
  const [isOpen, setIsOpen] = React.useState(true)

  const [openModel, hideModel] = useModalHook(
    () => (
      <Dialog isOpen={isOpen} {...dialogProps}>
        <RunPipelineForm pipelineIdentifier={pipelineIdentifier} inputSetOption={inputSetOption} onClose={closeModel} />
      </Dialog>
    ),
    [inputSetOption, pipelineIdentifier]
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
