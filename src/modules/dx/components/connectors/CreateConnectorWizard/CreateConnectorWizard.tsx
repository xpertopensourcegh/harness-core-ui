import React from 'react'
import { Connectors } from 'modules/dx/constants'
import CreateGITConnector from 'modules/dx/components/connectors/CreateConnector/GITConnector/CreateGITConnector'
import CreateK8sConnector from 'modules/dx/components/connectors/CreateConnector/K8sConnector/CreateK8sConnector'
import css from './CreateConnectorWizard.module.scss'
interface CreateConnectorWizardProps {
  accountId: string
  type: string
  hideLightModal: () => void
}

export const getConnectorWizardByType = (type: string, accountId: string, hideLightModal: () => void) => {
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return <CreateK8sConnector accountId={accountId} hideLightModal={hideLightModal} />
    case Connectors.GIT:
      return <CreateGITConnector accountId={accountId} hideLightModal={hideLightModal} />
    default:
      return null
  }
}

export const CreateConnectorWizard = (props: CreateConnectorWizardProps) => {
  return (
    <div className={css.createConnectorWizard}>
      {getConnectorWizardByType(props.type, props.accountId, props.hideLightModal)}
    </div>
  )
}
