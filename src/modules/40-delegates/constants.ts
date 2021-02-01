export const DelegateTypes = {
  KUBERNETES_CLUSTER: 'K8sCluster',
  DOCKER: 'DOCKER',
  ECS: 'ECS',
  LINUX: 'LINUX'
}

export const POLL_INTERVAL = 2 /* sec */ * 1000 /* ms */
export const TIME_OUT = 10 * 60 * 1000

export enum DelegateStatus {
  ENABLED = 'ENABLED',
  WAITING_FOR_APPROVAL = 'WAITING_FOR_APPROVAL',
  DISABLED = 'DISABLED',
  DELETED = 'DELETED'
}
