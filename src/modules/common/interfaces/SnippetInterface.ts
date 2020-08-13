import type { IconName } from '@wings-software/uikit'

export interface SnippetInterface {
  name: string
  version: string
  description?: string
  yaml: string
  iconName?: IconName
}
