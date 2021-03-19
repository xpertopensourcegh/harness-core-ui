import { Dialog, IDialogProps } from '@blueprintjs/core'
import { Layout, useModalHook } from '@wings-software/uicore'
import { upperFirst } from 'lodash-es'
import React from 'react'
import { useStrings } from 'framework/exports'
import { DelegateSelectionLogsTask } from './DelegateSelectionLogsTask'
import css from './DelegateSelectionLogs.module.scss'

export interface DelegateSelectionLogsProps {
  taskIds: string[]
}

export interface UseDelegateSelectionLogsModalReturn {
  openDelegateSelectionLogsModal: (taskIds: string[], modalProps?: IDialogProps) => void
  hideModal: () => void
}

export function DelegateSelectionLogs({ taskIds }: DelegateSelectionLogsProps): JSX.Element {
  return (
    <Layout.Vertical spacing="xxlarge" padding="large" className={css.main}>
      {taskIds.map(taskId => (
        <DelegateSelectionLogsTask key={taskId} taskId={taskId} />
      ))}
    </Layout.Vertical>
  )
}

export function useDelegateSelectionLogsModal(): UseDelegateSelectionLogsModalReturn {
  const [delegateTaskIds, setDelegateTaskIds] = React.useState<string[]>([])
  const { getString } = useStrings()
  const [modalProps, setModalProps] = React.useState<IDialogProps>({
    isOpen: true,
    title: upperFirst(getString('delegateSelectionLogs')),
    isCloseButtonShown: true,
    onClose: () => {
      hideModal()
    },
    style: {
      width: 900,
      minHeight: 240,
      borderLeft: 0,
      paddingBottom: 0,
      position: 'relative',
      overflow: 'hidden'
    }
  })

  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog {...modalProps}>
        <DelegateSelectionLogs taskIds={delegateTaskIds} />
      </Dialog>
    ),
    [delegateTaskIds, modalProps]
  )
  return {
    openDelegateSelectionLogsModal: (taskIds, _modalProps?: IDialogProps | undefined) => {
      setDelegateTaskIds(taskIds)
      setModalProps(_modalProps || modalProps)
      showModal()
    },
    hideModal
  }
}
