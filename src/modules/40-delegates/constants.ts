import type { DelegateInfoDTO } from 'services/cd-ng'

interface DelegateType {
  [key: string]: DelegateInfoDTO['type']
}

export const Delegates: DelegateType = {
  KUBERNETES_CLUSTER: 'K8sCluster'
}
