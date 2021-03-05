import type { IconName } from '@wings-software/uicore'
import type { ConnectorInfoDTO, PageConnectorResponse } from 'services/cd-ng'
import type { StageElementWrapper, NgPipeline } from 'services/cd-ng'

export interface ManifestSelectionProps {
  isForOverrideSets: boolean
  identifierName?: string
  isForPredefinedSets: boolean
  isPropagating?: boolean
  overrideSetIdentifier?: string
}

export interface ManifestListViewProps {
  pipeline: NgPipeline
  isForOverrideSets: boolean
  manifestList: {}[] | undefined
  updatePipeline: (pipeline: NgPipeline) => Promise<void>
  identifierName?: string
  stage: StageElementWrapper | undefined
  isForPredefinedSets: boolean
  isPropagating?: boolean
  overrideSetIdentifier?: string
  connectors: PageConnectorResponse | undefined
}

interface PathDataType {
  path: string
  uuid: string
}

export interface ManifestStepInitData {
  connectorRef: string | undefined
  store: ConnectorInfoDTO['type'] | string
}
export interface ManifestDataType {
  identifier: string
  branch: string | undefined
  commitId: string | undefined
  gitFetchType: 'Branch' | 'Commit'
  paths: Array<PathDataType> | Array<string> | undefined
}
export type ManifestTypes = 'K8sManifest' | 'Values'

export const manifestTypeIcons: Record<string, IconName> = {
  K8sManifest: 'file',
  Values: 'config-file'
}
