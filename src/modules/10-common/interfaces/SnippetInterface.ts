import type { IconName } from '@wings-software/uikit'
import type { ResponseYamlSnippets, ResponseString } from 'services/cd-ng'
import type { UseGetMockData } from 'modules/10-common/utils/testUtils'
import type { YamlEntity } from '../constants/YamlConstants'

export interface SnippetInterface {
  name: string
  version: string
  description?: string
  yaml: string
  iconName?: IconName
}

export interface SnippetSectionProps {
  entityType: YamlEntity
  entitySubType?: string
  showIconMenu?: boolean
  onSnippetSearch?: (query: string) => void
  height?: React.CSSProperties['height']
  width?: React.CSSProperties['width']
  mockMetaData?: UseGetMockData<ResponseYamlSnippets>
  mockSnippetData?: UseGetMockData<ResponseString>
}
