import type { SnippetInterface } from './SnippetInterface'

export interface YamlBuilderHandlerBinding {
  getLatestYaml: () => string
}

export default interface YamlBuilderProps {
  height?: number
  width?: number
  fileName: string
  existingYaml?: string
  entityType: string
  bind?: (dynamicPopoverHandler: YamlBuilderHandlerBinding) => void
  invocationMap?: Map<string, InvocationContext>
  isReadOnlyMode?: boolean
  showSnippetSection?: boolean
  snippets?: SnippetInterface[]
  showIconMenu?: boolean
  onSnippetSearch?: (queryString: string) => void
}

export interface InvocationContext {
  serviceHook: Function
  args: Record<string, any>
}
