import type { ConnectorDTO } from 'services/cd-ng'

interface ConnectorType {
  [key: string]: ConnectorDTO['type']
}
export const Connectors: ConnectorType = {
  KUBERNETES_CLUSTER: 'K8sCluster',
  GIT: 'Git',
  SECRET_MANAGER: 'Vault',
  APP_DYNAMICS: 'AppDynamics',
  SPLUNK: 'Splunk',
  DOCKER: 'DockerRegistry'
}

export const ConnectorInfoText = {
  KUBERNETES_CLUSTER: 'Kubernetes',
  GIT: 'GIT',
  SECRET_MANAGER: 'Secret Manager',
  APP_DYNAMICS: 'AppDynamics',
  SPLUNK: 'Splunk',
  DOCKER: 'Docker',
  YAML: 'Create via YAML Builder'
}
