import React from 'react'

import { Text } from '@wings-software/uicore'
import { CopyText } from '@common/components/CopyText/CopyText'

import type { PipelineVariablesData } from '../types'
import css from '../PipelineVariables.module.scss'

export interface VariableListTableProps<T = Record<string, unknown>> {
  data: T
  originalData: T
  metadataMap: PipelineVariablesData['metadataMap']
}

export function VariableListTable<T>(props: VariableListTableProps<T>): React.ReactElement {
  const { data, metadataMap, originalData } = props

  return (
    <div className={css.variableListTable}>
      {Object.entries(data || {}).map(([key, value]) => {
        if (typeof value !== 'string' || key === 'uuid' || !value) return null

        const metadata = metadataMap?.[value]

        if (!metadata) return null

        return (
          <React.Fragment key={key}>
            <CopyText textToCopy={metadata.yamlProperties?.fqn || ''}>
              &lt;+{metadata.yamlProperties?.localName}&gt;
            </CopyText>
            <Text>String</Text>
            <Text>{originalData?.[key as keyof T]}</Text>
          </React.Fragment>
        )
      })}
    </div>
  )
}
