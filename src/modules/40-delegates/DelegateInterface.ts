export interface DelegateInfoDTO {
  name: string
  identifier: string
  description?: string
  orgIdentifier?: string
  projectIdentifier?: string
  tags?: {
    [key: string]: string
  }
  type: 'K8sCluster'
}

export interface DelegateConfigDTO {
  [key: string]: any
}
