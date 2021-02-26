import React, { useCallback } from 'react'
import { Intent, Dialog, IconName, Classes, IDialogProps } from '@blueprintjs/core'
import { useModalHook, Button, ButtonProps } from '@wings-software/uicore'

export interface UseConfirmationDialogProps {
  titleText: string
  contentText: string | JSX.Element
  cancelButtonText: string
  intent?: Intent
  buttonIntent?: ButtonProps['intent']
  confirmButtonText?: string
  onCloseDialog?: (isConfirmed: boolean) => void
}

export interface UseConfirmationDialogReturn {
  openDialog: () => void
}

const getIconForIntent = (intent: Intent): IconName => {
  switch (intent) {
    case Intent.DANGER:
      return 'error'
    case Intent.WARNING:
      return 'warning-sign'
    case Intent.SUCCESS:
      return 'small-tick'
    case Intent.PRIMARY:
      return 'info-sign'
    default:
      return 'info-sign'
  }
}

const confirmDialogProps: IDialogProps = {
  isOpen: true,
  usePortal: true,
  autoFocus: true,
  canEscapeKeyClose: true,
  canOutsideClickClose: true,
  enforceFocus: true,
  style: { width: 500, minHeight: 200 }
}

export const useConfirmationDialog = (props: UseConfirmationDialogProps): UseConfirmationDialogReturn => {
  const {
    titleText,
    contentText,
    cancelButtonText,
    intent = Intent.NONE,
    buttonIntent = Intent.PRIMARY,
    confirmButtonText,
    onCloseDialog
  } = props
  const [showModal, hideModal] = useModalHook(() => {
    return (
      <Dialog title={titleText} icon={getIconForIntent(intent)} onClose={() => onClose(false)} {...confirmDialogProps}>
        <div className={Classes.DIALOG_BODY}>{contentText}</div>
        <div className={Classes.DIALOG_FOOTER}>
          {confirmButtonText && (
            <>
              <Button intent={buttonIntent} text={confirmButtonText} onClick={() => onClose(true)} /> &nbsp; &nbsp;
            </>
          )}
          <Button text={cancelButtonText} onClick={() => onClose(false)} />
        </div>
      </Dialog>
    )
  }, [titleText, contentText])

  const onClose = useCallback(
    isConfirmed => {
      onCloseDialog?.(isConfirmed)
      hideModal()
    },
    [hideModal, onCloseDialog]
  )

  return {
    openDialog: () => showModal()
  }
}
