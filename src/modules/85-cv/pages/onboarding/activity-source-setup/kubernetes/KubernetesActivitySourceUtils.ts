import type { SelectOption } from '@wings-software/uikit'
import type { KubernetesActivitySourceDTO } from 'services/cv'

export type WorkloadInfo = {
  serviceIdentifier?: SelectOption
  environmentIdentifier?: SelectOption
  workload: string
  selected: boolean
}

export type KubernetesConnectorType = 'Kubernetes'
export type NamespaceToWorkload = Map<string, Map<string, WorkloadInfo>> // namespace -> <workloadName, WorkloadInfo>
export interface KubernetesActivitySourceInfo
  extends Omit<KubernetesActivitySourceDTO, 'lastUpdatedAt' | 'activitySourceConfigs' | 'connectorIdentifier'> {
  selectedNamespaces: string[]
  selectedWorkloads: NamespaceToWorkload
  connectorType: KubernetesConnectorType
  connectorRef?: SelectOption
}
export function buildKubernetesActivitySourceInfo(): KubernetesActivitySourceInfo {
  return {
    identifier: '',
    selectedWorkloads: new Map<string, Map<string, WorkloadInfo>>(),
    selectedNamespaces: [],
    name: '',
    connectorType: 'Kubernetes'
  }
}
