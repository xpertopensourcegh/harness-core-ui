export type CreationType = 'Dockerhub' | 'Gcr'
export interface OrganizationCreationType {
  type: CreationType
}
enum TagTypes {
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
}

export interface ImagePathProps {
  key: string
  name: string
  context: number
  initialValues: ImagePathTypes
  handleSubmit: (data: {
    connectorId: undefined | { value: string }
    imagePath: string
    tag?: string
    tagRegex?: string
    identifier?: string
  }) => void
}

export interface ConnectorRefLabelType {
  firstStepName: string
  secondStepName: string
  newConnector: string
}
