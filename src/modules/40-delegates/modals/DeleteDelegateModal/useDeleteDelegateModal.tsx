import React, { useCallback, useState } from 'react'
import { useModalHook, Button, Layout, Heading, Icon, Text, Color } from '@wings-software/uicore'
import { Dialog, IDialogProps } from '@blueprintjs/core'
import { useStrings } from 'framework/exports'
import css from './useDeleteDelegateModal.module.scss'

export interface UseDeleteDelegateModalProps {
  delegateName: string
  onCloseDialog?: (isConfirmed: boolean) => void
}

export interface UseDeleteDelegateModalReturn {
  openDialog: () => void
}

export const useDeleteDelegateModal = (props: UseDeleteDelegateModalProps): UseDeleteDelegateModalReturn => {
  const { getString } = useStrings()
  const { onCloseDialog, delegateName } = props
  const [modalProps, setModalProps] = useState<IDialogProps>({
    isOpen: true,
    style: {
      width: 500,
      minHeight: 200,
      paddingBottom: 0,
      position: 'relative',
      overflow: 'hidden'
    }
  })

  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog {...modalProps} onClose={() => hideModal()}>
        <Layout.Vertical spacing="large">
          <Layout.Horizontal padding="large" style={{ alignItems: 'center' }}>
            <Icon name="info-sign" size={20} style={{ marginRight: '12px' }}></Icon>
            <Heading level={2} color={Color.GREY_800}>
              {getString('delegate.deleteDelegate')}
            </Heading>
          </Layout.Horizontal>
          <Layout.Horizontal padding="large">
            <Text color={Color.BLACK} font={{ size: 'normal', align: 'left' }}>
              {`${getString('delegate.questionDeleteDelegate')} ${delegateName}?`}
            </Text>
          </Layout.Horizontal>
          <Layout.Horizontal padding="xlarge">
            <Button intent="primary" style={{ marginRight: '18px' }} text="Delete" onClick={() => onClose(true)} />
            <Button outlined text="Cancel" onClick={() => onClose(false)} />
          </Layout.Horizontal>
        </Layout.Vertical>
        <Button minimal icon="cross" iconProps={{ size: 18 }} onClick={hideModal} className={css.crossIcon} />
      </Dialog>
    ),
    []
  )
  const onClose = useCallback(isConfirmed => {
    onCloseDialog?.(isConfirmed)
    hideModal()
  }, [])
  return {
    openDialog: (_modalProps?: IDialogProps | undefined) => {
      setModalProps(_modalProps || modalProps)
      showModal()
    }
  }
}
