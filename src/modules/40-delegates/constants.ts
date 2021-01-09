import type { DelegateInfoDTO } from './DelegateInterface'

interface DelegateType {
  [key: string]: DelegateInfoDTO['type']
}

export const Delegates: DelegateType = {
  KUBERNETES_CLUSTER: 'K8sCluster'
}
