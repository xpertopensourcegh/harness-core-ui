import React from 'react'
import { FontVariation, Text, Container, Color } from '@wings-software/uicore'
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
  onChange,
  fullPath
}: BasePathInterface): JSX.Element {
  const { getString } = useStrings()
  return (
    <div>
      <Text padding={{ bottom: 'medium' }} font={{ variation: FontVariation.H6 }}>
        {getString('cv.monitoringSources.appD.appdPathTitle')}
      </Text>
      <Text padding={{ bottom: 'medium' }}>{getString('cv.monitoringSources.appD.appdPathDetail')}</Text>
      <Container className={css.basePathContainer}>
        <Text font={{ variation: FontVariation.SMALL_BOLD }} color={Color.GREY_400} className={css.basePathLabel}>
          {getString('common.path')}
        </Text>
        <Text className={css.basePathValue} font={{ variation: FontVariation.SMALL_SEMI }}>
          {fullPath}
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
