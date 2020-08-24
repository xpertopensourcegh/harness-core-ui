import type { CompletionItemKind } from 'vscode-languageserver-types'
import type { SnippetInterface } from './SnippetInterface'

export interface YamlBuilderHandlerBinding {
  getLatestYaml: () => string
}

export interface YamlBuilderProps {
  height?: string
  width?: string
  fileName: string
  existingYaml?: string
  entityType: string
  bind?: (dynamicPopoverHandler: YamlBuilderHandlerBinding) => void
  invocationMap?: Map<RegExp, Function>
  isReadOnlyMode?: boolean
  showSnippetSection?: boolean
  snippets?: SnippetInterface[]
  showIconMenu?: boolean
  onSnippetSearch?: (queryString: string) => void
}

export interface CompletionItemInterface {
  label: string
  kind: CompletionItemKind
  insertText: string
}
