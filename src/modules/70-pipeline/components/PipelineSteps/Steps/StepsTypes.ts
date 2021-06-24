import type { SelectOption } from '@wings-software/uicore'
import type { ConnectorReferenceFieldProps } from '@connectors/components/ConnectorReferenceField/ConnectorReferenceField'

export type MapType = { [key: string]: string }
export type MultiTypeMapType = MapType | string
export type MapUIType = { id: string; key: string; value: string }[]
export type MultiTypeMapUIType = MapUIType | string
export type ListType = string[]
export type MultiTypeListType = ListType | string
export type ListUIType = { id: string; value: string }[]
export type MultiTypeListUIType = ListUIType | string
export type PullOption = 'ifNotExists' | 'never' | 'always'
export type MultiTypePullOption = PullOption | string
export type ArchiveFormatOption = 'Tar' | 'Gzip'
export type MultiTypeArchiveFormatOption = ArchiveFormatOption | string
export type ConnectorRef = ConnectorReferenceFieldProps['selected']
export type MultiTypeConnectorRef = ConnectorRef | string
export { SelectOption }
export type MultiTypeSelectOption = SelectOption | string
export interface Limits {
  memory?: string
  cpu?: string
}
export interface Resources {
  limits?: Limits
}
