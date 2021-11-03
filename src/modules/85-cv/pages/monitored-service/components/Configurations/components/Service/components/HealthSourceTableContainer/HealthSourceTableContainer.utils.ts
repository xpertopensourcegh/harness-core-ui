import type { FormikContext } from 'formik'
import type { RowData } from '@cv/pages/health-source/HealthSourceDrawer/HealthSourceDrawerContent.types'
import type { HealthSource, MonitoredServiceDTO } from 'services/cv'
import type { MonitoredServiceForm } from '../../Service.types'

export function createOpenHealthSourceTableProps({
  formik,
  tableData,
  isEdit,
  rowData
}: {
  formik: FormikContext<MonitoredServiceForm>
  isEdit: boolean
  rowData: RowData | null
  tableData: HealthSource[]
}): {
  isEdit: boolean
  rowData: RowData | null
  serviceRef: string
  environmentRef: string
  monitoredServiceRef: {
    name: string
    identifier: string
  }
  tableData: HealthSource[]
  monitoredServiceType: MonitoredServiceDTO['type']
} {
  return {
    isEdit,
    rowData,
    serviceRef: formik?.values.serviceRef,
    environmentRef: formik?.values.environmentRef,
    monitoredServiceRef: {
      name: formik?.values.name,
      identifier: formik?.values.identifier
    },
    tableData,
    monitoredServiceType: formik.values.type
  }
}
