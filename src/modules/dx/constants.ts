import type { ConnectorInfoDTO, ConnectorConnectivityDetails } from 'services/cd-ng'

interface ConnectorType {
  [key: string]: ConnectorInfoDTO['type']
}
interface ConnectorStatusType {
  [key: string]: ConnectorConnectivityDetails['status']
}
export const Connectors: ConnectorType = {
  KUBERNETES_CLUSTER: 'K8sCluster',
  GIT: 'Git',
  VAULT: 'Vault',
  APP_DYNAMICS: 'AppDynamics',
  SPLUNK: 'Splunk',
  DOCKER: 'DockerRegistry',
  GCP_KMS: 'GcpKms',
  LOCAL: 'Local'
}

export const ConnectorInfoText = {
  KUBERNETES_CLUSTER: 'Kubernetes',
  GIT: 'GIT',
  VAULT: 'Secret Manager',
  APP_DYNAMICS: 'AppDynamics',
  SPLUNK: 'Splunk',
  DOCKER: 'Docker',
  YAML: 'Create via YAML Builder',
  GCP_KMS: 'Secret Manager',
  LOCAL: 'Secret Manager'
}
export const ConnectorStatus: ConnectorStatusType = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE'
}

export const EntityTypes = {
  PIPELINE: 'pipelines',
  PROJECT: 'projects',
  CONNECTOR: 'connectors',
  SECRET: 'secrets'
}
