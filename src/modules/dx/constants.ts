import type { ConnectorDTO, ConnectorConnectivityDetails } from 'services/cd-ng'

interface ConnectorType {
  [key: string]: ConnectorDTO['type']
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
  DOCKER: 'DockerRegistry'
}

export const ConnectorInfoText = {
  KUBERNETES_CLUSTER: 'Kubernetes',
  GIT: 'GIT',
  VAULT: 'Secret Manager',
  APP_DYNAMICS: 'AppDynamics',
  SPLUNK: 'Splunk',
  DOCKER: 'Docker',
  YAML: 'Create via YAML Builder'
}
export const ConnectorStatus: ConnectorStatusType = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE'
}
