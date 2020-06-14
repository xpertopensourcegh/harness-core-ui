import React, { useState, useCallback } from 'react'
import { IDrawerProps, Position, Drawer } from '@blueprintjs/core'
import { Heading, Container, Text, Color, Button } from '@wings-software/uikit'
import i18n from './CustomizeMetricPackDrawer.i18n'
import { MetricPackTable } from '../MetricPackTable/MetricPackTable'
import type { MetricPack } from '@wings-software/swagger-ts/definitions'
import css from './CustomizeMetricPackDrawer.module.scss'

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
  const onCloseCallback = useCallback(() => onClose(), [onClose])

  return (
    <Drawer {...DrawerProps} isOpen={isOpen} onClose={onCloseCallback} className={css.main}>
      <Container className={css.headingContainer}>
        <Heading level={3} className={css.title}>
          {i18n.title}
        </Heading>
        <Text color={Color.BLACK}>{i18n.subTitle}</Text>
      </Container>
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
            />
          )
        })}
      </Container>
      <Button onClick={() => onClose(localMetricPacks)}>Submit</Button>
    </Drawer>
  )
}
