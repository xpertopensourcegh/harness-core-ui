import type { SelectOption } from '@pipeline/components/PipelineSteps/Steps/StepsTypes'
import type { AppDynamicsHealthSourceSpec, HealthSource, MonitoredServiceResponse } from 'services/cv'
import type { GCOLogsHealthSourceSpec } from '../connectors/GCOLogsMonitoringSource/components/MapQueriesToHarnessService/types'

export interface UpdatedHealthSource extends Omit<HealthSource, 'spec'> {
  spec: AppDynamicsHealthSourceSpec | GCOLogsHealthSourceSpec
}

export interface RowData extends HealthSource {
  service?: string
  environment?: string
  serviceRef?: string
  environmentRef?: string
}

export interface SourceDataInterface {
  isEdit: boolean
  serviceName: string
  serviceIdentifier: string
  environmentIdentifier: string
  environmentName: string
  monitoringSourceName: string
  monitoredServiceIdentifier: string
  rowData?: RowData | null
  tableData?: Array<RowData>
  modalOpen?: boolean
  createHeader?: () => JSX.Element
  onClose?: (val: any) => void
  sourceType?: string
  connectorRef?: string
  healthSourceName?: string
  healthSourceIdentifier?: string
  healthSourceList?: Array<RowData>
}

export interface HealthSourceDrawerInterface {
  rowData?: RowData | null
  tableData: Array<RowData>
  serviceRef: SelectOption | undefined
  environmentRef: SelectOption | undefined
  monitoringSourcRef: { monitoredServiceIdentifier: string; monitoredServiceName: string }
  onSuccess: (data: MonitoredServiceResponse) => void
  modalOpen: boolean
  createHeader: () => JSX.Element
  onClose: (val: any) => void
  isEdit: boolean
  shouldRenderAtVerifyStep?: boolean
}
