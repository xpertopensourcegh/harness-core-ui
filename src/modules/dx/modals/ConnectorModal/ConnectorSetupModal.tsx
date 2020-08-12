import React, { useState } from 'react'
import { ModalProvider, useModalHook, Button, Icon, IconName } from '@wings-software/uikit'
import { Dialog, IDialogProps, Position } from '@blueprintjs/core'
import { Menu, Popover } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'
import { Connectors, ConnectorInfoText } from 'modules/dx/constants'
import i18n from '../../components/connectors/CreateConnectorWizard/CreateConnectorWizard.i18n'
import { CreateConnectorWizard } from '../../components/connectors/CreateConnectorWizard/CreateConnectorWizard'
import css from '../../components/connectors/CreateConnectorWizard/CreateConnectorWizard.module.scss'

interface OptionInterface {
  label: string
  value: string
  icon: IconName
  onClick?: () => void
}

const getIcon = (icon: IconName): JSX.Element => {
  return <Icon name={icon} size={24} className={css.iconConnector} />
}

const getMenuItem = (item: OptionInterface): JSX.Element => {
  return (
    <div className={css.menuItemContent}>
      <span className={css.menulabel}>{item.label}</span>
      {getIcon(item.icon)}
    </div>
  )
}

const ConnectorModal: React.FC = () => {
  const { accountId } = useParams()
  const [connectorType, setConnectorType] = useState('')

  const modalPropsLight: IDialogProps = {
    isOpen: true,
    usePortal: true,
    autoFocus: true,
    canEscapeKeyClose: true,
    canOutsideClickClose: true,
    enforceFocus: true,
    style: {
      width: 'fit-content',
      minWidth: 960,
      height: 600,
      borderLeft: 0,
      paddingBottom: 0,
      position: 'relative',
      overflow: 'hidden'
    }
  }

  const [openLightModal, hideLightModal] = useModalHook(
    () => (
      <Dialog {...modalPropsLight}>
        <CreateConnectorWizard accountId={accountId} type={connectorType} hideLightModal={hideLightModal} />
        <Button minimal icon="cross" iconProps={{ size: 18 }} onClick={hideLightModal} className={css.crossIcon} />
      </Dialog>
    ),
    [connectorType]
  )
  const items: OptionInterface[] = [
    {
      label: ConnectorInfoText.KUBERNETES_CLUSTER,
      value: Connectors.KUBERNETES_CLUSTER,
      icon: 'service-kubernetes'
    },
    { label: ConnectorInfoText.GIT, value: Connectors.GIT, icon: 'service-github' },
    { label: ConnectorInfoText.AZURE, value: Connectors.AZURE, icon: 'service-jenkins' },
    { label: ConnectorInfoText.GCP, value: Connectors.GCP, icon: 'service-gcp' },
    { label: ConnectorInfoText.SECRET_MANAGER, value: Connectors.SECRET_MANAGER, icon: 'lock' }
  ]

  return (
    <React.Fragment>
      <Popover minimal position={Position.BOTTOM_RIGHT}>
        <Button intent="primary" text={i18n.NEW_CONNECTOR} rightIcon="chevron-down" padding="medium" />

        <Menu className={css.selectConnector}>
          {items.map((item, index) => {
            return (
              <Menu.Item
                className={css.menuItem}
                onClick={() => {
                  setConnectorType(item?.value)
                  openLightModal()
                }}
                key={index}
                text={getMenuItem(item)}
              />
            )
          })}
        </Menu>
      </Popover>
    </React.Fragment>
  )
}

export const ConnectorSetupModal: React.FC = () => {
  return (
    <ModalProvider>
      <ConnectorModal />
    </ModalProvider>
  )
}
