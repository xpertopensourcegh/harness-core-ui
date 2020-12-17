import React from 'react'
import { useParams } from 'react-router-dom'
import { Dialog, IDialogProps } from '@blueprintjs/core'
import { useModalHook } from '@wings-software/uikit'

import type { InputSetSelectorProps } from '@pipeline/components/InputSetSelector/InputSetSelector'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'

import { RunPipelineForm } from './RunPipelineForm'

export interface RunPipelineModalProps {
  children: React.ReactNode
  pipelineIdentifier: string
  inputSetSelected?: InputSetSelectorProps['value']
  className?: string
}

export const runPipelineDialogProps: Omit<IDialogProps, 'isOpen'> = {
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
  const { projectIdentifier, orgIdentifier, accountId } = useParams<ProjectPathProps>()
  const [openModel, hideModel] = useModalHook(
    () => (
      <Dialog isOpen={true} {...runPipelineDialogProps}>
        <RunPipelineForm
          pipelineIdentifier={pipelineIdentifier}
          orgIdentifier={orgIdentifier}
          projectIdentifier={projectIdentifier}
          accountId={accountId}
          inputSetSelected={inputSetSelected}
          onClose={hideModel}
        />
      </Dialog>
    ),
    [inputSetSelected, pipelineIdentifier, projectIdentifier, accountId, projectIdentifier]
  )

  return (
    <span
      className={className}
      onClick={e => {
        e.stopPropagation()
        openModel()
      }}
    >
      {children}
    </span>
  )
}
