import React from 'react'
import { Text, Container, Color } from '@wings-software/uikit'
import { isArray } from 'highcharts'
import styles from './BlueGreenVerificationChart.module.scss'

export const Colors = {
  Blue: Color.BLUE_500,
  Green: Color.GREEN_400,
  Red: Color.RED_500
}

const MAX_SERIE_LENGTH = 20

const validateSeries = (series: any) =>
  Array.isArray(series.before) &&
  isArray(series.after) &&
  series.after.length === 2 &&
  Array.isArray(series.after[0]) &&
  Array.isArray(series.after[1])

const seriesMock = {
  before: [
    { color: Colors.Blue },
    { color: Colors.Blue },
    { color: Colors.Blue },
    { color: Colors.Blue },
    { color: Colors.Blue },
    { color: Colors.Blue },
    { color: Colors.Blue },
    { color: Colors.Blue },
    { color: Colors.Blue },
    { color: Colors.Blue },
    { color: Colors.Blue },
    { color: Colors.Blue },
    { color: Colors.Blue },
    { color: Colors.Blue },
    { color: Colors.Blue }
  ],
  after: [
    [
      { color: Colors.Blue },
      { color: Colors.Blue },
      { color: Colors.Blue },
      { color: Colors.Blue },
      { color: Colors.Blue },
      { color: Colors.Blue },
      { color: Colors.Blue },
      { color: Colors.Blue },
      { color: Colors.Blue },
      { color: Colors.Blue },
      { color: Colors.Blue },
      { color: Colors.Blue },
      { color: Colors.Blue },
      { color: Colors.Blue },
      { color: Colors.Blue }
    ],
    [
      { color: Colors.Green },
      { color: Colors.Green },
      { color: Colors.Green },
      { color: Colors.Green },
      { color: Colors.Green },
      { color: Colors.Red },
      { color: Colors.Green },
      { color: Colors.Green },
      { color: Colors.Green },
      { color: Colors.Green },
      { color: Colors.Green },
      { color: Colors.Red },
      { color: Colors.Green },
      { color: Colors.Green },
      { color: Colors.Green }
    ]
  ]
}

export default function BlueGreenVerificationChart({
  series = seriesMock,
  onCellClick = (_cell: any) => alert('clicked'),
  beforeBluePercent = 100,
  afterBluePercent = 80,
  afterGreenPercent = 20
}) {
  if (!validateSeries(series)) {
    // invalid props: 'BlueGreenVerificationChart: invalid series'
    return null
  }
  const { before, after } = series
  const [aftera, afterb] = after

  const renderSeries = (data: Array<any>) =>
    data.map(
      (cell, i) =>
        i < MAX_SERIE_LENGTH && (
          <Container key={i} background={cell.color} onClick={() => onCellClick && onCellClick(cell)} />
        )
    )

  return (
    <Container className={styles.chart}>
      <div className={styles.boxWrap}>
        <Text>BEFORE</Text>
        <div className={styles.box}>{renderSeries(before)}</div>
        <Text>{`Blue ${beforeBluePercent} %`}</Text>
      </div>
      <div className={styles.separator}>
        <Text>Verification Triggered</Text>
      </div>
      <div className={styles.boxWrap}>
        <Text>AFTER</Text>
        <div className={styles.boxGroup}>
          <div className={styles.boxWrap}>
            <div className={styles.box}>{renderSeries(aftera)}</div>
            <Text>{`Blue (${afterBluePercent}%)`}</Text>
          </div>
          <div className={styles.boxWrap}>
            <div className={styles.box}>{renderSeries(afterb)}</div>
            <Text>{`Green (${afterGreenPercent}%)`}</Text>
          </div>
        </div>
      </div>
    </Container>
  )
}
