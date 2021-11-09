import type { Column } from 'react-table'
import type { ChangeSourceTypes } from '@cv/pages/ChangeSource/ChangeSourceDrawer/ChangeSourceDrawer.constants'

export interface ChangesTableInterface {
  startTime: number
  endTime: number
  hasChangeSource: boolean
  serviceIdentifier: string | string[]
  environmentIdentifier: string | string[]
  customCols?: Column<any>[]
  changeCategories?: ('Deployment' | 'Infrastructure' | 'Alert')[]
  changeSourceTypes?: ChangeSourceTypes[]
  recordsPerPage?: number
}
