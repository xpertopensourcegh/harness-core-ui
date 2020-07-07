import React, { useState, useCallback } from 'react'
import { SampleData, ActivityHeadingContent } from '../LogAnalysisRiskAndJiraModal/LogAnalysisRiskAndJiraModal'
import { Container, Heading, Color, Button } from '@wings-software/uikit'
import { Drawer, IDrawerProps, Position } from '@blueprintjs/core'
import css from './LogAnalysisCompareDrawer.module.scss'

interface LogAnalysisCompareModalProps {
  rowsToCompare: Array<{ count: number; logText: string; anomalyType: string; trendData: Highcharts.Options }>
  onHide: () => void
}

const DrawerProps: IDrawerProps = {
  autoFocus: true,
  canEscapeKeyClose: true,
  canOutsideClickClose: true,
  enforceFocus: true,
  isOpen: true,
  hasBackdrop: true,
  position: Position.RIGHT,
  usePortal: true,
  size: '75%'
}

export default function LogAnalysisCompareDrawer(props: LogAnalysisCompareModalProps): JSX.Element {
  const { rowsToCompare, onHide } = props
  const [isOpen, setOpen] = useState(true)
  const onHideCallback = useCallback(() => {
    setOpen(false)
    onHide()
  }, [onHide])
  return (
    <Drawer {...DrawerProps} onClose={onHideCallback} isOpen={isOpen} className={css.main}>
      {rowsToCompare.map((row, index) => {
        const { anomalyType, count, trendData, logText } = row
        return (
          <Container className={css.rowContent} key={`${count}-${trendData}-${anomalyType}-${index}`}>
            <Heading level={2} color={Color.BLACK} className={css.anomalyType}>
              {anomalyType}
            </Heading>
            <ActivityHeadingContent count={count} trendData={trendData} />
            <SampleData logMessage={logText} />
          </Container>
        )
      })}
      <Container className={css.buttonContainer}>
        <Button onClick={onHideCallback}>Back</Button>
      </Container>
    </Drawer>
  )
}
