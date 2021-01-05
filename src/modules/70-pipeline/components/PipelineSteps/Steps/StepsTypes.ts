import type { SelectOption } from '@wings-software/uicore'
import type { Item as ConnectorRef } from '@common/components/ReferenceSelect/ReferenceSelect'

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
export { ConnectorRef }
export type MultiTypeConnectorRef = ConnectorRef | string
export { SelectOption }
export type MultiTypeSelectOption = SelectOption | string
export interface Limits {
  memory?: string
  cpu?: string
}
export interface Resources {
  resources?: Resources
}
