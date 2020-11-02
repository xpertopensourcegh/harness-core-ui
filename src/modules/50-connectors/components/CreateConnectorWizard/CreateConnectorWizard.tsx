import React from 'react'
import { Connectors } from '@connectors/constants'
import CreateGITConnector from '@connectors/components/CreateConnector/GITConnector/CreateGITConnector'
import CreateK8sConnector from '@connectors/components/CreateConnector/K8sConnector/CreateK8sConnector'
import CreateSecretManager from '@connectors/components/CreateConnector/SecretManager/CreateSecretManager'
import type { ConnectorRequestBody, ConnectorInfoDTO } from 'services/cd-ng'
import CreateAppDynamicsConnector from '../CreateConnector/AppDynamicsConnector/CreateAppDynamicsConnector'
import CreateSplunkConnector from '../CreateConnector/SplunkConnector/CreateSplunkConnector'
import CreateDockerConnector from '../CreateConnector/DockerConnector/CreateDockerConnector'
import CreateAWSConnector from '../CreateConnector/AWSConnector/CreateAWSConnector'
import CreateNexusConnector from '../CreateConnector/NexusConnector/CreateNexusConnector'
import CreateArtifactoryConnector from '../CreateConnector/ArtifactoryConnector/CreateArtifactoryConnector'
import CreateGcpConnector from '../CreateConnector/GcpConnector/CreateGcpConnector'
import css from './CreateConnectorWizard.module.scss'

interface CreateConnectorWizardProps {
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  type: ConnectorInfoDTO['type']
  hideLightModal: () => void
  onSuccess: (data?: ConnectorRequestBody) => void | Promise<void>
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
          onSuccess={props.onSuccess}
          projectIdentifier={projectIdentifier}
        />
      )
    case Connectors.VAULT:
      return <CreateSecretManager hideLightModal={hideLightModal} onSuccess={props.onSuccess} />
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
          onConnectorCreated={props.onSuccess}
          accountId={accountId}
          hideLightModal={hideLightModal}
          orgIdentifier={orgIdentifier}
          projectIdentifier={projectIdentifier}
        />
      )
    case Connectors.DOCKER:
      return <CreateDockerConnector onConnectorCreated={props.onSuccess} hideLightModal={hideLightModal} />
    case Connectors.AWS:
      return <CreateAWSConnector onConnectorCreated={props.onSuccess} hideLightModal={hideLightModal} />
    case Connectors.NEXUS:
      return <CreateNexusConnector onConnectorCreated={props.onSuccess} hideLightModal={hideLightModal} />
    case Connectors.ARTIFACTORY:
      return <CreateArtifactoryConnector onConnectorCreated={props.onSuccess} hideLightModal={hideLightModal} />
    case Connectors.GCP:
      return <CreateGcpConnector onConnectorCreated={props.onSuccess} hideLightModal={hideLightModal} />
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
