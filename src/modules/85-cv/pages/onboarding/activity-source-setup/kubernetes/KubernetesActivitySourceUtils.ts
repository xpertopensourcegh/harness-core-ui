import type { SelectOption } from '@wings-software/uicore'
import type { ActivitySourceDTO } from 'services/cv'

export type WorkloadInfo = {
  serviceIdentifier?: SelectOption
  environmentIdentifier?: SelectOption
  workload: string
  selected: boolean
}

export type KubernetesConnectorType = 'Kubernetes'
export type NamespaceToWorkload = Map<string, Map<string, WorkloadInfo>> // namespace -> <workloadName, WorkloadInfo>
export interface KubernetesActivitySourceInfo
  extends Omit<ActivitySourceDTO, 'lastUpdatedAt' | 'activitySourceConfigs' | 'connectorIdentifier'> {
  selectedNamespaces: string[]
  selectedWorkloads: NamespaceToWorkload
  connectorType: KubernetesConnectorType
  connectorRef?: SelectOption
}

export interface KubernetesNamespaceWorkloadDTO {
  serviceIdentifier: string
  envIdentifier: string
  namespace: string
  workloadName: string
}

export interface KubernetesActivitySourceDTO extends ActivitySourceDTO {
  connectorIdentifier: string
  activitySourceConfigs: KubernetesNamespaceWorkloadDTO[]
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
