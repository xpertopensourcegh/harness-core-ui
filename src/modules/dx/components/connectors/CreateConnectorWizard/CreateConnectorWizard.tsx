import React from 'react'
import { Connectors } from 'modules/dx/constants'
import CreateGITConnector from 'modules/dx/components/connectors/CreateConnector/GITConnector/CreateGITConnector'
import CreateK8sConnector from 'modules/dx/components/connectors/CreateConnector/K8sConnector/CreateK8sConnector'
import CreateSecretManager from 'modules/dx/components/connectors/CreateConnector/SecretManager/CreateSecretManager'
import css from './CreateConnectorWizard.module.scss'

interface CreateConnectorWizardProps {
  accountId: string
  type: string
  hideLightModal: () => void
}

export const ConnectorWizard: React.FC<CreateConnectorWizardProps> = ({ type, accountId, hideLightModal }) => {
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return <CreateK8sConnector accountId={accountId} hideLightModal={hideLightModal} />
    case Connectors.GIT:
      return <CreateGITConnector accountId={accountId} hideLightModal={hideLightModal} />
    case Connectors.SECRET_MANAGER:
      return <CreateSecretManager accountId={accountId} hideLightModal={hideLightModal} />
    default:
      return null
  }
}

export const CreateConnectorWizard: React.FC<CreateConnectorWizardProps> = props => {
  return (
    <div className={css.createConnectorWizard}>
      <ConnectorWizard {...props} />
    </div>
  )
}
