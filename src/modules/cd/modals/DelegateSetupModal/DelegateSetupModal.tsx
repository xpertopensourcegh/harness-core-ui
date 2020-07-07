import React from 'react'
import { ModalProvider, useModalHook, Button, Icon, IconName } from '@wings-software/uikit'
import { Dialog, IDialogProps, Position } from '@blueprintjs/core'
import css from './DelegateSetupModal.module.scss'
import { CreateConnectorWizard } from 'modules/dx/components/CreateConnectorWizard/CreateConnectorWizard'
import { Menu, Popover } from '@blueprintjs/core'
import i18n from './DelegateSetup.i18n'
import { useParams } from 'react-router-dom'

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

const DelegateModal: React.FC = () => {
  const { accountId } = useParams()

  const modalPropsLight: IDialogProps = {
    isOpen: true,
    usePortal: true,
    autoFocus: true,
    canEscapeKeyClose: true,
    canOutsideClickClose: true,
    enforceFocus: true,
    style: { width: 960, height: 600, borderLeft: 0, paddingBottom: 0, position: 'relative', overflow: 'hidden' }
  }

  const [openLightModal, hideLightModal] = useModalHook(() => (
    <Dialog {...modalPropsLight}>
      <CreateConnectorWizard accountId={accountId} />
      <Button minimal icon="cross" iconProps={{ size: 18 }} onClick={hideLightModal} className={css.crossIcon} />
    </Dialog>
  ))
  const items: OptionInterface[] = [
    { label: 'Kubernetes', value: 'service-kubernetes', icon: 'service-kubernetes', onClick: openLightModal },
    { label: 'Git', value: 'service-github', icon: 'service-github' },
    { label: 'Jenkins', value: 'service-jenkins', icon: 'service-jenkins' },
    { label: 'GCP', value: 'service-gcp', icon: 'service-gcp' }
  ]

  return (
    <React.Fragment>
      {/* <Link  href={routeConnectorDetails.url({accountId:'kmpySmUISimoRrJL6NL73w',editMode:true})}> */}
      <Popover minimal position={Position.BOTTOM_RIGHT}>
        <Button
          intent="primary"
          text={i18n.NEW_CONNECTOR}
          rightIcon="chevron-down"
          large
          style={{ borderRadius: 8 }}
          // onClick={openLightModal}    Disabling temporarily
          padding="medium"
        />

        <Menu className={css.selectConnector}>
          {items.map((item, index) => {
            return (
              <Menu.Item
                className={css.menuItem}
                // href={`#${routeConnectorDetails.url({ accountId: accountId, editMode: 'true', type: item.value })}`}
                // href={`#${routeConnectorDetails.url({ accountId: accountId, editMode: 'true' })}`}
                onClick={item?.onClick}
                key={index}
                text={getMenuItem(item)}
              />
            )
          })}
        </Menu>
      </Popover>

      {/* </Link> */}
    </React.Fragment>
  )
}

export const DelegateSetupModal: React.FC = () => {
  return (
    <ModalProvider>
      <DelegateModal />
    </ModalProvider>
  )
}
