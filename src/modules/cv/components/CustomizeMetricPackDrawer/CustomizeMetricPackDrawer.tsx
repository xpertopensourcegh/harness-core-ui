import React, { useState, useCallback, useMemo } from 'react'
import { IDrawerProps, Position, Drawer } from '@blueprintjs/core'
import { Heading, Container, Text, Color, Button } from '@wings-software/uikit'
import i18n from './CustomizeMetricPackDrawer.i18n'
import { MetricPackTable } from '../MetricPackTable/MetricPackTable'
import type { MetricPack, MetricDefinition } from '@wings-software/swagger-ts/definitions'
import css from './CustomizeMetricPackDrawer.module.scss'
import ConfigureThreshold from 'modules/cv/pages/metric-pack/ConfigureThreshold'

const DrawerProps: IDrawerProps = {
  autoFocus: true,
  canEscapeKeyClose: true,
  canOutsideClickClose: true,
  enforceFocus: true,
  isOpen: false,
  hasBackdrop: true,
  position: Position.RIGHT,
  usePortal: true
}

interface CustomizeMetricPackDrawerProps {
  isOpen: boolean
  onClose: (updatedMetricPacks?: MetricPack[]) => void
  selectedMetricPackObjects: MetricPack[]
}

function transformThresholdsToHints(values: any, selectedThresholdMetricPack: MetricPack) {
  const metricThresholds = new Map<string, MetricDefinition>()
  for (const metric of selectedThresholdMetricPack.metrics || []) {
    if (metric.name) {
      metric.failFastHints = []
      metric.ignoreHints = []
      metricThresholds.set(metric.name, metric)
    }
  }

  for (const ignoreThreshold of values?.metrics?.ignoreMetrics || []) {
    const metric = metricThresholds.get(ignoreThreshold.name)
    if (ignoreThreshold && metric?.ignoreHints) {
      metric.ignoreHints.push({
        action: ignoreThreshold.action,
        criteria: ignoreThreshold.criteria,
        occurrenceCount: ignoreThreshold.occurrenceCount,
        type: ignoreThreshold.type
      })
    }
  }

  for (const failFastThreshold of values?.metrics.failMetrics || []) {
    const metric = metricThresholds.get(failFastThreshold.name)
    if (failFastThreshold && metric?.failFastHints) {
      metric.failFastHints.push({
        action: failFastThreshold.action,
        criteria: failFastThreshold.criteria,
        occurrenceCount: failFastThreshold.occurrenceCount,
        type: failFastThreshold.type
      })
    }
  }

  return { ...selectedThresholdMetricPack }
}

export function CustomizeMetricPackDrawer(props: CustomizeMetricPackDrawerProps): JSX.Element {
  const { isOpen, onClose, selectedMetricPackObjects } = props
  const [localMetricPacks, setLocalMetricPacks] = useState(selectedMetricPackObjects)
  const [{ displayThresholds, selectedThresholdMetricPack }, setDisplayThresholds] = useState<{
    displayThresholds: boolean
    selectedThresholdMetricPack?: MetricPack
  }>({
    displayThresholds: false,
    selectedThresholdMetricPack: undefined
  })
  const onCloseCallback = useCallback(() => onClose(), [onClose])
  const onConfigureThresholdClickCallback = useCallback((metricPack: MetricPack) => {
    setDisplayThresholds({ displayThresholds: true, selectedThresholdMetricPack: metricPack })
  }, [])
  const onUpdateConfigMetricsCallback = useCallback(
    (values: any) => {
      const updatedMetrics = transformThresholdsToHints(
        values,
        selectedThresholdMetricPack || { dataSourceType: 'APP_DYNAMICS' }
      )
      setDisplayThresholds({
        displayThresholds: false,
        selectedThresholdMetricPack: updatedMetrics
      })
    },
    [selectedThresholdMetricPack]
  )

  const titleAndSubtitle = useMemo(() => {
    if (displayThresholds) {
      return {
        title: i18n.thresholdTitle,
        subtitle: `${i18n.thresholdSubtitle} - ${selectedThresholdMetricPack?.identifier}`
      }
    }
    return {
      title: i18n.metricPackTitle,
      subtitle: i18n.metricPackSubtitle
    }
  }, [displayThresholds, selectedThresholdMetricPack?.identifier])

  return (
    <Drawer {...DrawerProps} isOpen={isOpen} onClose={onCloseCallback} className={css.main}>
      <Container className={css.headingContainer}>
        <Heading level={3} className={css.title}>
          {titleAndSubtitle.title}
        </Heading>
        <Text color={Color.BLACK}>{titleAndSubtitle.subtitle}</Text>
      </Container>
      {!displayThresholds ? (
        <Container className={css.tableContainer}>
          {localMetricPacks.map((metricPack, index) => {
            return (
              <MetricPackTable
                key={metricPack.identifier}
                metricPackName={metricPack.identifier || ''}
                metrics={metricPack || []}
                onChange={(updatedMetricPack: MetricPack) => {
                  const newLocalMetricPacks = [...localMetricPacks]
                  newLocalMetricPacks[index] = updatedMetricPack
                  setLocalMetricPacks(newLocalMetricPacks)
                }}
                onConfigureThresholdClick={onConfigureThresholdClickCallback}
              />
            )
          })}
        </Container>
      ) : (
        <ConfigureThreshold
          metricPack={selectedThresholdMetricPack}
          dataSourceType="APP_DYNAMICS"
          onUpdateConfigMetrics={onUpdateConfigMetricsCallback}
        />
      )}
      <Button onClick={() => onClose(localMetricPacks)}>Submit</Button>
    </Drawer>
  )
}
