import type { SelectOption } from '@wings-software/uicore'

import { StringUtils } from '@common/exports'
import type { ConnectorFilterProperties, FilterDTO } from 'services/cd-ng'
import type { FilterDataInterface, FilterInterface } from '@common/components/Filter/Constants'

export const getValidFilterArguments = (formData: Record<string, any>): ConnectorFilterProperties => {
  const typeOptions = formData?.types?.map((type: SelectOption) => type?.value)
  const statusOptions = formData?.connectivityStatuses
    ?.filter((status: SelectOption) => status?.value !== 'NA')
    .map((status: SelectOption) => status?.value)
  return {
    connectorNames: formData?.connectorNames || [],
    connectorIdentifiers: formData?.connectorIdentifiers || [],
    description: formData?.description || '',
    types: typeOptions,
    connectivityStatuses: statusOptions,
    tags: formData?.tags
  }
}

export type ConnectorFormType = Omit<ConnectorFilterProperties, 'types' | 'connectivityStatuses'> & {
  types?: SelectOption[]
  connectivityStatuses?: SelectOption[]
}

export const createRequestBodyPayload = ({
  isUpdate,
  data,
  projectIdentifier,
  orgIdentifier
}: {
  isUpdate: boolean
  data: FilterDataInterface<ConnectorFormType, FilterInterface>
  projectIdentifier: string
  orgIdentifier: string
}): FilterDTO => {
  const {
    metadata: { name: _name, visible, identifier },
    formValues
  } = data
  const {
    connectorNames: _connectorNames,
    connectorIdentifiers: _connectorIdentifiers,
    description: _description,
    types: _types,
    connectivityStatuses: _connectivityStatuses,
    tags: _tags
  } = getValidFilterArguments(formValues)
  return {
    name: _name,
    identifier: isUpdate ? identifier : StringUtils.getIdentifierFromName(_name),
    projectIdentifier,
    orgIdentifier,
    filterVisibility: visible,
    filterProperties: {
      filterType: 'Connector',
      connectorNames: typeof _connectorNames === 'string' ? [_connectorNames] : _connectorNames,
      connectorIdentifiers: typeof _connectorIdentifiers === 'string' ? [_connectorIdentifiers] : _connectorIdentifiers,
      description: _description,
      types: _types,
      connectivityStatuses: _connectivityStatuses,
      tags: _tags
    } as ConnectorFilterProperties
  }
}

type supportedTypes = string | number | boolean | object

export const renderItemByType = (data: supportedTypes | Array<supportedTypes> | object): string => {
  if (Array.isArray(data)) {
    return data.join(', ')
  } else if (typeof data === 'object') {
    return Object.entries(data as object)
      .map(([key, value]) => {
        return key
          .toString()
          .concat(' : ')
          .concat(value ? value.toString() : '<no-value>')
      })
      .join(', ')
  } else if (typeof data === 'number') {
    return data.toString()
  } else if (typeof data === 'boolean') {
    return data ? 'true' : 'false'
  }
  return typeof data === 'string' ? data : ''
}
