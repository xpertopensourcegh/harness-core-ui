import React, { useState, useCallback, useMemo } from 'react'
import { IDrawerProps, Position, Drawer } from '@blueprintjs/core'
import { Heading, Container, Text, Color, Button } from '@wings-software/uikit'
import i18n from './CustomizeMetricPackDrawer.i18n'
import { MetricPackTable } from '../MetricPackTable/MetricPackTable'
import type { MetricPack } from '@wings-software/swagger-ts/definitions'
import css from './CustomizeMetricPackDrawer.module.scss'
import ConfigureThreshold from 'modules/cv/pages/metric-pack/ConfigureThreshold'
import { updateMetricPackHints, transformMetricPackToThresholds } from './CustomizeMetricPackDrawerUtils'

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

export function CustomizeMetricPackDrawer(props: CustomizeMetricPackDrawerProps): JSX.Element {
  const { isOpen, onClose, selectedMetricPackObjects } = props
  const [localMetricPacks, setLocalMetricPacks] = useState(selectedMetricPackObjects)
  const [{ displayThresholds, selectedThresholdMetricPack, failFastAndIgnoreHints }, setDisplayThresholds] = useState<{
    displayThresholds: boolean
    selectedThresholdMetricPack?: MetricPack
    failFastAndIgnoreHints: { failFastHints: any[]; ignoreHints: any[] }
  }>({
    displayThresholds: false,
    selectedThresholdMetricPack: undefined,
    failFastAndIgnoreHints: { failFastHints: [], ignoreHints: [] }
  })
  const onCloseCallback = useCallback(() => onClose(), [onClose])
  const onConfigureThresholdClickCallback = useCallback((metricPack: MetricPack) => {
    setDisplayThresholds({
      displayThresholds: true,
      selectedThresholdMetricPack: metricPack,
      failFastAndIgnoreHints: transformMetricPackToThresholds(metricPack)
    })
  }, [])
  const onUpdateConfigMetricsCallback = useCallback(
    (values: any) => {
      const updatedMetrics = updateMetricPackHints(
        values,
        selectedThresholdMetricPack || { dataSourceType: 'APP_DYNAMICS' }
      )
      setDisplayThresholds({
        displayThresholds: false,
        selectedThresholdMetricPack: updatedMetrics,
        failFastAndIgnoreHints: { failFastHints: [], ignoreHints: [] }
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
          hints={failFastAndIgnoreHints}
        />
      )}
      <Button onClick={() => onClose(localMetricPacks)}>Submit</Button>
    </Drawer>
  )
}
