export interface MetricPathData {
  [key: string]: { value: string; path: string; isMetric?: boolean }
}

export interface MetaPathInterface {
  tier: string
  appName: string
  baseFolder: string
  metricPathValue: MetricPathData
  connectorIdentifier: string
  onChange: (key: string, value: MetricPathData) => void
}
