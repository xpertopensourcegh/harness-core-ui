import React from 'react'
import { Text, Container, Color } from '@wings-software/uikit'
import styles from './BlueGreenVerificationChart.module.scss'

export const Colors = {
  Blue: Color.BLUE_500,
  Green: Color.GREEN_400,
  Red: Color.RED_500
}

const MAX_SERIE_LENGTH = 18

interface NodeData {
  name?: string
  riskScore?: string
}

export interface BlueGreenVerificationChartProps {
  before: Array<NodeData>
  after: Array<NodeData>
  percentageBefore: number
  percentageAfter: number
  onNodeClick?(): void
}

const mapColor = (riskScore?: string): Color => {
  switch (riskScore) {
    case 'LOW_RISK':
      return Color.GREEN_400
    case 'MEDIUM_RISK':
      return Color.ORANGE_500
    case 'HIGH_RISK':
      return Color.RED_500
    default:
      return Color.GREY_300
  }
}

export default function BlueGreenVerificationChart({
  before,
  after,
  percentageBefore,
  percentageAfter,
  onNodeClick
}: BlueGreenVerificationChartProps) {
  const renderSeries = (data: Array<NodeData>, color?: Color) =>
    data.map(
      (cell, i) =>
        i < MAX_SERIE_LENGTH && (
          <Container key={i} background={color || mapColor(cell.riskScore)} onClick={() => onNodeClick?.()} />
        )
    )

  return (
    <Container className={styles.chart}>
      <div className={styles.boxWrap}>
        <Text>BEFORE</Text>
        <div className={styles.box}>{renderSeries(before, Color.BLUE_500)}</div>
        <Text>{`Blue ${100} %`}</Text>
      </div>
      <div className={styles.separator}>
        <Text>Verification Triggered</Text>
      </div>
      <div className={styles.boxWrap}>
        <Text>AFTER</Text>
        <div className={styles.boxGroup}>
          <div className={styles.boxWrap}>
            <div className={styles.box}>{renderSeries(before, Color.BLUE_500)}</div>
            <Text>{`Blue (${percentageBefore}%)`}</Text>
          </div>
          <div className={styles.boxWrap}>
            <div className={styles.box}>{renderSeries(after)}</div>
            <Text>{`Green (${percentageAfter}%)`}</Text>
          </div>
        </div>
      </div>
    </Container>
  )
}
