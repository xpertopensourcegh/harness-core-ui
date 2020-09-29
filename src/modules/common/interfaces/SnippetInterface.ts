import type { IconName } from '@wings-software/uikit'
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
  showIconMenu?: boolean
  snippets?: SnippetInterface[]
  onSnippetSearch?: (query: string) => void
}
