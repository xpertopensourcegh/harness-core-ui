import React, { useMemo } from 'react'
import { FormInput, Text } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import type { MetaPathInterface } from './MetricPath.types'
import MetricPathDropdown from './Components/MetricPathDropdown/MetricPathDropdown'
import { getSecondLastItemKey, onMetricPathChange } from './MetricPath.utils'

export default function MetricPath({
  tier,
  appName,
  baseFolder,
  metricPathValue,
  connectorIdentifier,
  onChange
}: MetaPathInterface): JSX.Element {
  const { getString } = useStrings()

  const secondLastItemKey = useMemo(() => getSecondLastItemKey(metricPathValue), [metricPathValue])

  return (
    <FormInput.CustomRender
      name="metricPath"
      render={() => {
        return (
          <div>
            <Text padding={{ bottom: 'medium', top: 'medium' }}>
              {getString('cv.monitoringSources.appD.appdMetricDetail')}
            </Text>
            {Object.entries(metricPathValue)?.map((item, index) => {
              const data = {
                key: item[0],
                value: item[1]
              }

              if (Object.entries(metricPathValue).length - 1 === index) {
                if (metricPathValue[secondLastItemKey].isMetric) {
                  return <></>
                }
              }

              return (
                <MetricPathDropdown
                  onChange={selectedMetric => {
                    onChange('metricPath', onMetricPathChange(selectedMetric, index, metricPathValue))
                  }}
                  tier={tier}
                  key={`${item}_${index}`}
                  appName={appName}
                  metricPath={data.value.path}
                  selectedValue={data.value.value}
                  baseFolder={baseFolder}
                  connectorIdentifier={connectorIdentifier}
                />
              )
            })}
          </div>
        )
      }}
    />
  )
}
