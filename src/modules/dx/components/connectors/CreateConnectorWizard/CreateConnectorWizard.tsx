import React from 'react'
import { Connectors } from 'modules/dx/constants'
import CreateGITConnector from 'modules/dx/components/connectors/CreateConnector/GITConnector/CreateGITConnector'
import CreateK8sConnector from 'modules/dx/components/connectors/CreateConnector/K8sConnector/CreateK8sConnector'
import CreateSecretManager from 'modules/dx/components/connectors/CreateConnector/SecretManager/CreateSecretManager'
import css from './CreateConnectorWizard.module.scss'

interface CreateConnectorWizardProps {
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  type: string
  hideLightModal: () => void
}

export const ConnectorWizard: React.FC<CreateConnectorWizardProps> = props => {
  switch (props.type) {
    case Connectors.KUBERNETES_CLUSTER:
      return (
        <CreateK8sConnector
          accountId={props.accountId}
          orgIdentifier={props.orgIdentifier}
          projectIdentifier={props.projectIdentifier}
          hideLightModal={props.hideLightModal}
        />
      )
    case Connectors.GIT:
      return (
        <CreateGITConnector
          accountId={props.accountId}
          hideLightModal={props.hideLightModal}
          orgIdentifier={props.orgIdentifier}
          projectIdentifier={props.projectIdentifier}
        />
      )
    case Connectors.SECRET_MANAGER:
      return (
        <CreateSecretManager
          accountId={props.accountId}
          hideLightModal={props.hideLightModal}
          orgIdentifier={props.orgIdentifier}
          projectIdentifier={props.projectIdentifier}
        />
      )
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
