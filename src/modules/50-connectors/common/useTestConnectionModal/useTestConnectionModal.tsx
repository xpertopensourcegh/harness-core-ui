import React, { useState } from 'react'
import { useModalHook, Button, Container } from '@wings-software/uicore'
import { Dialog, IDialogProps } from '@blueprintjs/core'

import type { ConnectorInfoDTO } from 'services/cd-ng'
import VerifyOutOfClusterDelegate from '../VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import css from './useTestConnectionModal.module.scss'

export interface UseTestConnectionModalProps {
  onClose?: () => void
}

export interface UseTestConnectionModalReturn {
  openErrorModal: (connectorIdentifier: string, connectorType: ConnectorInfoDTO['type'], connectorUrl: string) => void
  hideErrorModal: () => void
}
const modalProps: IDialogProps = {
  isOpen: true,
  style: {
    width: 850,
    minHeight: 345,
    borderLeft: 0,
    paddingBottom: 0,
    position: 'relative',
    overflow: 'hidden'
  }
}

const useTestConnectionModal = (props: UseTestConnectionModalProps): UseTestConnectionModalReturn => {
  const [identifier, setIdentifier] = useState<string>('')
  const [type, setType] = useState<ConnectorInfoDTO['type']>('' as ConnectorInfoDTO['type'])
  const [url, setUrl] = useState<string>('')

  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog {...modalProps}>
        <Container height={'100%'} padding="xxlarge">
          <VerifyOutOfClusterDelegate connectorIdentifier={identifier} isStep={false} url={url} type={type} />
        </Container>
        <Button
          minimal
          icon="cross"
          iconProps={{ size: 18 }}
          onClick={() => {
            props.onClose?.()
            hideModal()
          }}
          className={css.crossIcon}
        />
      </Dialog>
    ),
    [identifier, type, url]
  )

  return {
    openErrorModal: (connectorIdentifier: string, connectorType: ConnectorInfoDTO['type'], connectorUrl: string) => {
      setIdentifier(connectorIdentifier)
      setType(connectorType)
      setUrl(connectorUrl)
      showModal()
    },
    hideErrorModal: hideModal
  }
}

export default useTestConnectionModal
