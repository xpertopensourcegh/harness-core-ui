import React, { useState } from 'react'
import { useModalHook, Button } from '@wings-software/uikit'
import { Dialog, IDialogProps } from '@blueprintjs/core'
import { useParams } from 'react-router'
import { CreateConnectorWizard } from '@connectors/components/CreateConnectorWizard/CreateConnectorWizard'
import { Connectors } from '@connectors/constants'
import type { ConnectorInfoDTO, ConnectorRequestBody } from 'services/cd-ng'
import css from '../../components/CreateConnectorWizard/CreateConnectorWizard.module.scss'

export interface UseCreateConnectorModalProps {
  onSuccess?: (data?: ConnectorRequestBody) => void
}

export interface UseCreateConnectorModalReturn {
  openConnectorModal: (type: ConnectorInfoDTO['type'], modalProps?: IDialogProps) => void
  hideConnectorModal: () => void
}

const useCreateConnectorModal = (props: UseCreateConnectorModalProps): UseCreateConnectorModalReturn => {
  const [type, setType] = useState<ConnectorInfoDTO['type']>(Connectors.KUBERNETES_CLUSTER)
  const [modalProps, setModalProps] = useState<IDialogProps>({
    isOpen: true,
    style: {
      width: 960,
      minHeight: 600,
      borderLeft: 0,
      paddingBottom: 0,
      position: 'relative',
      overflow: 'hidden'
    }
  })
  const { accountId, projectIdentifier, orgIdentifier } = useParams()

  const handleSuccess = (data?: ConnectorRequestBody): void => {
    props.onSuccess?.(data)
  }

  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog {...modalProps}>
        <CreateConnectorWizard
          accountId={accountId}
          orgIdentifier={orgIdentifier}
          projectIdentifier={projectIdentifier}
          type={type}
          onSuccess={handleSuccess}
          hideLightModal={hideModal}
        />
        <Button
          minimal
          icon="cross"
          iconProps={{ size: 18 }}
          onClick={() => {
            hideModal()
          }}
          className={css.crossIcon}
        />
      </Dialog>
    ),
    [type]
  )

  return {
    openConnectorModal: (_type: ConnectorInfoDTO['type'], _modalProps?: IDialogProps | undefined) => {
      setType(_type)
      setModalProps(_modalProps || modalProps)
      showModal()
    },
    hideConnectorModal: hideModal
  }
}

export default useCreateConnectorModal
