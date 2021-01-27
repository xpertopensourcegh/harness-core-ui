import React from 'react'
import { isPlainObject, get } from 'lodash-es'

import { Text } from '@wings-software/uicore'
import { CopyText } from '@common/components/CopyText/CopyText'
import type { VariableMergeServiceResponse } from 'services/pipeline-ng'
import { toVariableStr } from '@common/utils/StringUtils'

import css from './VariablesListTable.module.scss'

export interface VariableListTableProps<T = Record<string, unknown>> {
  data: T
  originalData: T
  metadataMap: Required<VariableMergeServiceResponse>['metadataMap']
}

export function VariablesListTable<T>(props: VariableListTableProps<T>): React.ReactElement | null {
  const { data, metadataMap, originalData } = props

  if (!data || !originalData || !metadataMap) return null

  return (
    <div className={css.variablesListTable}>
      {Object.entries(data || {}).map(([key, value]) => {
        if (typeof value !== 'string' || key === 'uuid' || !value) return null

        const metadata = metadataMap[value]
        const finalvalue = get(originalData, key)

        let formattedValue

        if (Array.isArray(finalvalue)) {
          formattedValue = finalvalue.join(', ')
        } else if (isPlainObject(finalvalue)) {
          formattedValue = JSON.stringify(finalvalue, null, 2)
        } else {
          formattedValue = finalvalue
        }

        if (!metadata || !formattedValue) return null

        return (
          <React.Fragment key={key}>
            <CopyText textToCopy={toVariableStr(metadata.yamlProperties?.fqn || '')}>
              {metadata.yamlProperties?.localName}
            </CopyText>
            <Text lineClamp={1}>{formattedValue}</Text>
          </React.Fragment>
        )
      })}
    </div>
  )
}
