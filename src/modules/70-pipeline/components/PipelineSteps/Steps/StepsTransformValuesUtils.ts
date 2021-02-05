import type { SelectOption } from '@wings-software/uicore'
import { v4 as nameSpace, v5 as uuid } from 'uuid'
import { get, set, isEmpty, isObjectLike, isPlainObject } from 'lodash-es'
import { getMultiTypeFromValue, MultiTypeInputType } from '@wings-software/uicore'
import type {
  MapType,
  MultiTypeConnectorRef,
  MultiTypeSelectOption,
  MultiTypeListUIType,
  MultiTypeMapUIType
} from './StepsTypes'

export enum Types {
  Text,
  Map,
  List,
  ArchiveFormat,
  Pull,
  ConnectorRef,
  ReportPaths,
  LimitMemory,
  LimitCPU
}

interface Field {
  name: string
  type: Types
}

type Dependencies = { [key: string]: any }

export function removeEmptyKeys<T>(object: { [key: string]: any }): T {
  Object.keys(object).forEach(key => {
    if ((isObjectLike(object[key]) && isEmpty(object[key])) || !object[key]) {
      delete object[key]
      return
    }

    if (isPlainObject(object[key])) {
      removeEmptyKeys(object[key])

      if (isEmpty(object[key])) {
        delete object[key]
      }
    }
  })

  return object as T
}

export function getInitialValuesInCorrectFormat<T, U>(
  initialValues: T,
  fields: Field[],
  { archiveFormatOptions, pullOptions }: Dependencies = {}
): U {
  const values = {}

  fields.forEach(({ name, type }) => {
    const value = get(initialValues, name)

    if (type === Types.Text || type === Types.ConnectorRef) {
      set(values, name, value)
    }

    if (type === Types.Map) {
      const map =
        typeof value === 'string'
          ? value
          : Object.keys(value || {}).map(key => ({
              id: uuid('', nameSpace()),
              key: key,
              value: value[key]
            }))

      // Adding a default value
      if (Array.isArray(map) && map.length === 0) {
        map.push({ id: uuid('', nameSpace()), key: '', value: '' })
      }

      set(values, name, map)
    }

    if (type === Types.List) {
      const list =
        typeof value === 'string'
          ? value
          : value?.map((_value: string) => ({
              id: uuid('', nameSpace()),
              value: _value
            })) || []

      // Adding a default value
      if (Array.isArray(list) && list.length === 0) {
        list.push({ id: uuid('', nameSpace()), value: '' })
      }

      set(values, name, list)
    }

    if (type === Types.ArchiveFormat) {
      const archiveFormat =
        getMultiTypeFromValue(value) === MultiTypeInputType.FIXED
          ? archiveFormatOptions?.find((option: SelectOption) => option.value === value) || archiveFormatOptions[0]
          : value

      set(values, name, archiveFormat)
    }

    if (type === Types.Pull) {
      const pull =
        getMultiTypeFromValue(value) === MultiTypeInputType.FIXED
          ? pullOptions?.find((option: SelectOption) => option.value === value) || pullOptions[0]
          : value

      set(values, name, pull)
    }

    if (type === Types.LimitMemory) {
      const _value = get(initialValues, 'spec.resources.limits.memory')
      set(values, 'spec.limitMemory', _value)
    }

    if (type === Types.ReportPaths) {
      const _value = get(initialValues, 'spec.reports.spec.paths')

      const list =
        typeof _value === 'string'
          ? _value
          : _value?.map((val: string) => ({
              id: uuid('', nameSpace()),
              value: val
            })) || []

      // Adding a default value
      if (Array.isArray(list) && list.length === 0) {
        list.push({ id: uuid('', nameSpace()), value: '' })
      }

      set(values, 'spec.reportPaths', list)
    }

    if (type === Types.LimitCPU) {
      const _value = get(initialValues, 'spec.resources.limits.cpu')
      set(values, 'spec.limitCPU', _value)
    }
  })

  return values as U
}

export function getFormValuesInCorrectFormat<T, U>(formValues: T, fields: Field[]): U {
  const values = {}

  fields.forEach(({ name, type }) => {
    if (type === Types.Text) {
      const value = get(formValues, name)
      set(values, name, value)
    }

    if (type === Types.Map) {
      const value = get(formValues, name) as MultiTypeMapUIType

      const map: MapType = {}
      if (Array.isArray(value)) {
        value.forEach(mapValue => {
          if (mapValue.key) {
            map[mapValue.key] = mapValue.value
          }
        })
      }

      set(values, name, typeof value === 'string' ? value : map)
    }

    if (type === Types.List) {
      const value = get(formValues, name) as MultiTypeListUIType

      const list =
        typeof value === 'string'
          ? value
          : value?.filter(listValue => !!listValue.value).map(listValue => listValue.value)
      set(values, name, list)
    }

    if (type === Types.ConnectorRef) {
      const value = get(formValues, name) as MultiTypeConnectorRef

      const connectorRef = typeof value === 'string' ? value : value?.value
      set(values, name, connectorRef)
    }

    if (type === Types.ArchiveFormat || type === Types.Pull) {
      const value = get(formValues, name) as MultiTypeSelectOption

      const pull = typeof value === 'string' ? value : value?.value
      set(values, name, pull)
    }

    if (type === Types.ReportPaths) {
      const _value = get(formValues, 'spec.reportPaths') as MultiTypeListUIType

      const list =
        typeof _value === 'string'
          ? _value
          : _value?.filter(listValue => !!listValue.value).map(listValue => listValue.value)

      if (!isEmpty(list)) {
        set(values, 'spec.reports.type', 'JUnit')
      }

      set(values, 'spec.reports.spec.paths', list)
    }

    if (type === Types.LimitMemory) {
      const _value = get(formValues, 'spec.limitMemory')
      set(values, 'spec.resources.limits.memory', _value)
    }

    if (type === Types.LimitCPU) {
      const _value = get(formValues, 'spec.limitCPU')
      set(values, 'spec.resources.limits.cpu', _value)
    }
  })

  return removeEmptyKeys<U>(values)
}
