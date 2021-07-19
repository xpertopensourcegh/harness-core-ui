import type { SelectOption } from '@pipeline/components/PipelineSteps/Steps/StepsTypes'
import type { MonitoredServiceResponse } from 'services/cv'
import type { RowData } from '../HealthSourceDrawer/HealthSourceDrawerContent.types'

export interface HealthSourceTableInterface {
  value: Array<RowData>
  breadCrumbRoute?: {
    routeTitle: string
  }
  monitoringSourcRef: { monitoredServiceIdentifier: string; monitoredServiceName: string }
  serviceRef: SelectOption | undefined
  environmentRef: SelectOption | undefined
  onSuccess: (value: MonitoredServiceResponse) => void
  onDelete?: (value: MonitoredServiceResponse) => void
  isEdit?: boolean
  shouldRenderAtVerifyStep?: boolean
  isRunTimeInput?: boolean
}
