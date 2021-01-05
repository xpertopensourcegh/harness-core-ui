import React, { useState, useCallback, useEffect } from 'react'
import { Container, Text, Link, Card, Color } from '@wings-software/uicore'

import type { MetricPack } from 'services/cv'
import i18n from './MetricPackTable.i18n'
import css from './MetricPackTable.module.scss'

interface TableWithCheckColumnsProps {
  metrics: MetricPack
  metricPackName: string
  onChange?: (selectedMetrics: MetricPack) => void
  onConfigureThresholdClick: (metricPack: MetricPack) => void
}

export function MetricPackTable(props: TableWithCheckColumnsProps): JSX.Element {
  const { metrics, onChange, metricPackName, onConfigureThresholdClick } = props
  const [metricData, setMetricData] = useState<MetricPack>(metrics)

  useEffect(() => {
    // move all checked options to the top
    metricData?.metrics?.sort((a, b) => {
      if (!a) {
        return 1
      } else if (!b) {
        return -1
      } else if (a.included && !b.included) {
        return -1
      } else if (b.included && !a.included) {
        return 1
      }

      return a.name && b.name ? a.name?.localeCompare(b.name) : 1
    })
    setMetricData({ ...metricData })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onConfigureThresholdCallback = useCallback(() => {
    onConfigureThresholdClick(metricData)
  }, [onConfigureThresholdClick, metricData])

  return (
    <Container className={css.main}>
      <Card className={css.metricTableCard}>
        <Container className={css.metricPackHeader}>
          <Text className={css.metricPackName}>
            {metricPackName} ({metricData?.metrics?.length})
          </Text>
          <Link withoutHref onClick={onConfigureThresholdCallback} className={css.configureThresholdLink}>
            {i18n.configureThreholdLinkText}
          </Link>
        </Container>
        <ul className={css.metricList}>
          {metricData?.metrics?.map((metric, index) => (
            <li key={metric.name} className={css.metricContent}>
              <input
                type="checkbox"
                checked={metric.included || false}
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                  const updatedMetricPack = { ...metricData }
                  if (updatedMetricPack?.metrics?.[index]) {
                    updatedMetricPack.metrics[index].included = e.currentTarget.checked
                    setMetricData(updatedMetricPack)
                    onChange?.(updatedMetricPack)
                  }
                }}
                className={css.included}
              />
              <Text width={200} lineClamp={1} color={Color.BLACK}>
                {metric.name}
              </Text>
            </li>
          ))}
        </ul>
      </Card>
    </Container>
  )
}
