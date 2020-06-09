import React from 'react'
import { IDrawerProps, Position, Drawer } from '@blueprintjs/core'
import { Heading, Container, Text } from '@wings-software/uikit'
import i18n from './CustomizeMetricPackDrawer.i18n'
// import { SelectedMetric, MetricPackTable } from '../MetricPackTable/MetricPackTable'
import type { MetricPack } from '@wings-software/swagger-ts/definitions'

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
  onClose: () => void
  selectedMetricPackObjects: MetricPack[]
}

export function CustomizeMetricPackDrawer(props: CustomizeMetricPackDrawerProps): JSX.Element {
  const { isOpen, onClose, selectedMetricPackObjects } = props
  console.log(selectedMetricPackObjects)
  return (
    <Drawer {...DrawerProps} isOpen={isOpen} onClose={onClose}>
      <Container>
        <Heading level={3}>{i18n.title}</Heading>
        <Text>{i18n.subTitle}</Text>
      </Container>
      <Container>{/* {data.map(())} */}</Container>
    </Drawer>
  )
}
