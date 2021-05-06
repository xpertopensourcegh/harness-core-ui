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
  openErrorModal: (connector: ConnectorInfoDTO, connectorUrl: string) => void
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
  const [connectorInfo, setConnectorInfo] = useState<ConnectorInfoDTO>({} as ConnectorInfoDTO)
  const [url, setUrl] = useState<string>('')

  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog {...modalProps}>
        <Container height={'100%'} padding="xxlarge">
          <VerifyOutOfClusterDelegate
            connectorInfo={connectorInfo}
            isStep={false}
            url={url}
            type={connectorInfo.type}
          />
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
    [connectorInfo, url]
  )

  return {
    openErrorModal: (connector: ConnectorInfoDTO, connectorUrl: string) => {
      setConnectorInfo(connector)
      setUrl(connectorUrl)
      showModal()
    },
    hideErrorModal: hideModal
  }
}

export default useTestConnectionModal
