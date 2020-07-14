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
}
