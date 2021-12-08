import type {
  CreatedMetricsWithSelectedIndex,
  MapAppDynamicsMetric,
  SelectedAndMappedMetrics
} from '../../AppDHealthSource.types'

export interface AppDMappedMetricInterface {
  setMappedMetrics: React.Dispatch<React.SetStateAction<SelectedAndMappedMetrics>>
  selectedMetric: string
  formikValues: MapAppDynamicsMetric
  formikSetField: (key: string, value: any) => void
  connectorIdentifier: string
  mappedMetrics: Map<string, MapAppDynamicsMetric>
  createdMetrics: string[]
  isValidInput: boolean
  setCreatedMetrics: React.Dispatch<React.SetStateAction<CreatedMetricsWithSelectedIndex>>
}
