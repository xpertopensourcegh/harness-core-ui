import type { CompletionItemKind } from 'vscode-languageserver-types'
import type { SnippetInterface } from './SnippetInterface'
import type { YamlEntity } from '../constants/YamlConstants'

export interface YamlBuilderHandlerBinding {
  getLatestYaml: () => string
  getYAMLValidationErrorMap: () => Map<string, string>
}

export interface YamlBuilderProps {
  height?: string
  width?: string
  fileName: string
  existingJSON?: Record<string, any>
  entityType: YamlEntity
  bind?: (dynamicPopoverHandler: YamlBuilderHandlerBinding) => void
  invocationMap?: Map<RegExp, Function>
  isReadOnlyMode?: boolean
  showSnippetSection?: boolean
  snippets?: SnippetInterface[]
  showIconMenu?: boolean
  onSnippetSearch?: (queryString: string) => void
  onExpressionTrigger?: (yamlPath: string, currentExpression: string) => Promise<CompletionItemInterface[]>
}

export interface CompletionItemInterface {
  label: string
  kind: CompletionItemKind
  insertText: string
}
