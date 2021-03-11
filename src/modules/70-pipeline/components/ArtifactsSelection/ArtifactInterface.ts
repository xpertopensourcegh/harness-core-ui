export interface ArtifactsSelectionProps {
  isForOverrideSets?: boolean
  isForPredefinedSets?: boolean
  identifierName?: string
  isPropagating?: boolean
  overrideSetIdentifier?: string
}

export type CreationType = 'Dockerhub' | 'Gcr' | 'Ecr'
export interface OrganizationCreationType {
  type: CreationType
}
export enum TagTypes {
  Value = 'value',
  Regex = 'regex'
}

export interface ConnectorDataType {
  connectorId: string | undefined
}
export interface ImagePathTypes {
  identifier: string
  imagePath: string
  tag: string
  tagRegex: string
  tagType: TagTypes
  registryHostname?: string
  region?: string
}

export interface ImagePathProps {
  key: string
  name: string
  context: number
  initialValues: ImagePathTypes
  handleSubmit: (data: any) => void
}

export interface ConnectorRefLabelType {
  firstStepName: string
  secondStepName: string
  newConnector: string
}
