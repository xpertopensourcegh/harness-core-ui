export interface BasePathData {
  [key: string]: { value: string; path: string }
}

export interface BasePathInterface {
  fullPath: string
  connectorIdentifier: string
  appName: string
  basePathValue: BasePathData
  onChange: (key: string, value: BasePathData) => void
}
