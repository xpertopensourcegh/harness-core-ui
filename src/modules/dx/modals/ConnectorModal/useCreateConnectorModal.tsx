import React, { useState } from 'react'
import { useModalHook, Button } from '@wings-software/uikit'
import { Dialog, IDialogProps } from '@blueprintjs/core'
import { useParams } from 'react-router'
import { CreateConnectorWizard } from 'modules/dx/components/connectors/CreateConnectorWizard/CreateConnectorWizard'
import { Connectors } from 'modules/dx/constants'
import type { ConnectorDTO, ConnectorConfigDTO } from 'services/cd-ng'
import css from '../../components/connectors/CreateConnectorWizard/CreateConnectorWizard.module.scss'

export interface UseCreateConnectorModalProps {
  onSuccess?: (data?: ConnectorConfigDTO) => void
}

export interface UseCreateConnectorModalReturn {
  openConnectorModal: (type: ConnectorDTO['type'], modalProps?: IDialogProps) => void
  hideConnectorModal: () => void
}

const useCreateConnectorModal = (props: UseCreateConnectorModalProps): UseCreateConnectorModalReturn => {
  const [type, setType] = useState<ConnectorDTO['type']>(Connectors.KUBERNETES_CLUSTER)
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

  const handleSuccess = (data?: ConnectorConfigDTO): void => {
    hideModal()
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
            props.onSuccess?.()
          }}
          className={css.crossIcon}
        />
      </Dialog>
    ),
    [type]
  )

  return {
    openConnectorModal: (_type: ConnectorDTO['type'], _modalProps?: IDialogProps | undefined) => {
      setType(_type)
      setModalProps(_modalProps || modalProps)
      showModal()
    },
    hideConnectorModal: hideModal
  }
}

export default useCreateConnectorModal
