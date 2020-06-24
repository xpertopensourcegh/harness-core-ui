import React from 'react'
import { Text, Card, StatusBar, Color } from '@wings-software/uikit'
import styles from './ServiceCard.module.scss'
import classnames from 'classnames'

export interface ServiceCardProps {
  className?: string
  label: string
  impact: number
  verificationPassed: number
  verificationFailed: number
  changeEventsPassed: number
  changeEventsFailed: number
  openAnomalies: number
}

const colors = [
  Color.GREEN_400,
  Color.GREEN_500,
  Color.YELLOW_400,
  Color.YELLOW_450,
  Color.YELLOW_500,
  Color.ORANGE_500,
  Color.RED_500,
  Color.RED_600
]

export default function ServiceCard({
  className,
  label,
  impact = 0,
  verificationPassed = 0,
  verificationFailed = 0,
  changeEventsPassed = 0,
  changeEventsFailed = 0,
  openAnomalies = 0
}: ServiceCardProps): JSX.Element {
  const headerProps: any = {
    width: 150,
    lineClamp: 1,
    font: 'small'
  }

  const cellTextProps: any = {
    width: 150,
    lineClamp: 1,
    font: { weight: 'bold' }
  }

  return (
    <Card className={classnames(styles.card, className)}>
      <Text color="black" font={{ weight: 'bold' }}>
        {label}
      </Text>
      <div>
        <div className={styles.row}>
          <div className={styles.cell}>
            <Text {...headerProps}>Verification Impact</Text>
            <div className={styles.impactBarWrap}>
              <StatusBar
                width={110}
                height={5}
                background={colors[0 + Math.round(Math.min(Math.max(impact, 0), 1) * 7)]}
              />
            </div>
          </div>
          <div className={styles.cell}>
            <Text {...headerProps} width={130}>
              Anomalies
            </Text>
            <Text {...cellTextProps} width={130}>
              {openAnomalies} Open
            </Text>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.cell}>
            <Text {...headerProps}>Deployment Verification</Text>
            <Text {...cellTextProps}>{`${verificationPassed} passed ${verificationFailed} failed`}</Text>
          </div>
          <div className={styles.cell}>
            <Text {...headerProps} width={130}>
              Change Events
            </Text>
            <Text {...cellTextProps} width={130} lineClamp={1}>
              {`${changeEventsPassed} passed ${changeEventsFailed} failed`}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  )
}
