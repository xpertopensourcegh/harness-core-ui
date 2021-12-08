import React from 'react'
import { FontVariation, Text, Container } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import BasePathDropdown from './Components/BasePathDropdown/BasePathDropdown'
import type { BasePathInterface } from './BasePath.types'
import { onBasePathChange } from './BasePath.utils'
import { MetricPathInitValue } from '../MetricPath/MetricPath.constants'
import css from './BasePath.module.scss'

export default function BasePath({
  connectorIdentifier,
  appName,
  basePathValue,
  onChange
}: BasePathInterface): JSX.Element {
  const { getString } = useStrings()

  const lastItem = Object.keys(basePathValue)[Object.keys(basePathValue).length - 1]

  return (
    <div>
      <Text padding={{ bottom: 'medium' }} font={{ variation: FontVariation.H6 }}>
        {getString('cv.monitoringSources.appD.appdPathTitle')}
      </Text>
      <Text padding={{ bottom: 'medium' }}>{getString('cv.monitoringSources.appD.appdPathDetail')}</Text>
      <Container className={css.basePathContainer}>
        <Text font={{ variation: FontVariation.TINY_SEMI }} className={css.basePathLabel}>
          {getString('common.path')}
        </Text>
        <Text className={css.basePathValue} font={{ variation: FontVariation.TINY_SEMI }}>
          {basePathValue[lastItem]?.path}
        </Text>
      </Container>
      {Object.entries(basePathValue).map((item, index) => {
        const data = {
          key: item[0],
          value: item[1]
        }
        return (
          <BasePathDropdown
            onChange={selectedPathMetric => {
              const updatedMetric = onBasePathChange(selectedPathMetric, index, basePathValue)
              onChange('basePath', updatedMetric)
              onChange('metricPath', MetricPathInitValue)
            }}
            key={`${item}_${index}`}
            name={`basePath`}
            appName={appName}
            path={data.value.path}
            selectedValue={data.value.value}
            connectorIdentifier={connectorIdentifier}
          />
        )
      })}
    </div>
  )
}
