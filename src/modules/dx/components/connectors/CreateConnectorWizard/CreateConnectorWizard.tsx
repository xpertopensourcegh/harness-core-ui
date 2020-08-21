import React from 'react'
import { Connectors } from 'modules/dx/constants'
import CreateGITConnector from 'modules/dx/components/connectors/CreateConnector/GITConnector/CreateGITConnector'
import CreateK8sConnector from 'modules/dx/components/connectors/CreateConnector/K8sConnector/CreateK8sConnector'
import CreateSecretManager from 'modules/dx/components/connectors/CreateConnector/SecretManager/CreateSecretManager'
import type { ConnectorConfigDTO } from 'services/cd-ng'
import CreateAppDynamicsConnector from '../CreateConnector/AppDynamicsConnector/CreateAppDynamicsConnector'
import CreateSplunkConnector from '../CreateConnector/SplunkConnector/CreateSplunkConnector'
import css from './CreateConnectorWizard.module.scss'

interface CreateConnectorWizardProps {
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  type: string
  hideLightModal: () => void
  onSuccess: (data?: ConnectorConfigDTO) => void | Promise<void>
}

export const ConnectorWizard: React.FC<CreateConnectorWizardProps> = props => {
  const { type, accountId, orgIdentifier, projectIdentifier, hideLightModal, ...rest } = props
  switch (type) {
    case Connectors.KUBERNETES_CLUSTER:
      return (
        <CreateK8sConnector
          accountId={props.accountId}
          orgIdentifier={props.orgIdentifier}
          projectIdentifier={props.projectIdentifier}
          onSuccess={props.onSuccess}
          hideLightModal={props.hideLightModal}
        />
      )
    case Connectors.GIT:
      return (
        <CreateGITConnector
          accountId={accountId}
          hideLightModal={hideLightModal}
          orgIdentifier={orgIdentifier}
          projectIdentifier={projectIdentifier}
        />
      )
    case Connectors.SECRET_MANAGER:
      return (
        <CreateSecretManager
          accountId={accountId}
          hideLightModal={hideLightModal}
          orgIdentifier={orgIdentifier}
          projectIdentifier={projectIdentifier}
        />
      )
    case Connectors.APP_DYNAMICS:
      return (
        <CreateAppDynamicsConnector
          {...rest}
          onConnectorCreated={props.onSuccess}
          accountId={accountId}
          hideLightModal={hideLightModal}
          orgIdentifier={orgIdentifier}
          projectIdentifier={projectIdentifier}
        />
      )
    case Connectors.SPLUNK:
      return (
        <CreateSplunkConnector
          {...rest}
          accountId={accountId}
          hideLightModal={hideLightModal}
          orgIdentifier={orgIdentifier}
          projectIdentifier={projectIdentifier}
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
