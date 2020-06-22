import React from 'react'
import { ModalProvider, useModalHook, Button, Icon } from '@wings-software/uikit'
import { Dialog, IDialogProps, Position } from '@blueprintjs/core'
import css from './DelegateSetupModal.module.scss'
import { DelegateStepWizard } from './DelegateStepWizard'
import { Menu, Popover } from '@blueprintjs/core'

import i18n from './DelegateSetup.i18n'
import { routeConnectorDetails } from 'modules/dx/routes'

const getIcon = (icon: any) => {
  return <Icon name={icon} size={14} className={css.iconConnector} />
}
const DelegateModal: React.FC = () => {
  const modalPropsLight: IDialogProps = {
    isOpen: true,
    usePortal: true,
    autoFocus: true,
    canEscapeKeyClose: true,
    canOutsideClickClose: true,
    enforceFocus: true,
    style: { width: 1200, height: 600, borderLeft: 0, paddingBottom: 0, position: 'relative', overflow: 'hidden' }
  }

  const items = [
    { label: 'Kubernetes', value: 'service-kubernetes', icon: 'service-kubernetes' },
    { label: 'GitHub', value: 'service-github', icon: 'service-github' },
    { label: 'ELK', value: 'service-elk', icon: 'service-elk' },
    { label: 'Jenkins', value: 'service-jenkins', icon: 'service-jenkins' },
    { label: 'GCP', value: 'service-gcp', icon: 'service-gcp' }
  ]

  const [, hideLightModal] = useModalHook(() => (
    <Dialog {...modalPropsLight}>
      <DelegateStepWizard />
      <Button minimal icon="cross" iconProps={{ size: 18 }} onClick={hideLightModal} className={css.crossIcon} />
    </Dialog>
  ))

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
                href={routeConnectorDetails.url({ accountId: 'kmpySmUISimoRrJL6NL73w', editMode: 'edit' })}
                key={index}
                text={item.label}
                icon={getIcon(item.icon)}
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
