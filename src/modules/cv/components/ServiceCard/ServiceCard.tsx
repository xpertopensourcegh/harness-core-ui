import React from 'react'
import { Text, Card, StatusBar, Color } from '@wings-software/uikit'
import classnames from 'classnames'

import styles from './ServiceCard.module.scss'

export interface ServiceCardProps {
  className?: string
  label: string
  impact: number
  verificationPassed: number
  verificationFailed: number
  changeEventsPassed: number
  changeEventsFailed: number
  openAnomalies: number
  onClick?(e: any): void
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
  openAnomalies = 0,
  onClick
}: ServiceCardProps): JSX.Element {
  const headerProps: any = {
    width: 110,
    lineClamp: 1,
    font: 'small'
  }

  const cellTextProps: any = {
    width: 110,
    lineClamp: 1,
    font: {
      weight: 'bold',
      size: 'small'
    }
  }

  return (
    <Card onClick={onClick} className={classnames(styles.card, className)}>
      <Text color="black" font={{ weight: 'bold' }}>
        {label}
      </Text>
      <div>
        <div className={styles.row}>
          <div className={styles.cell}>
            <Text className={styles.cellHeader} {...headerProps}>
              Verification Impact
            </Text>
            <div className={styles.impactBarWrap}>
              <StatusBar
                width={100}
                height={5}
                background={colors[0 + Math.round(Math.min(Math.max(impact, 0), 1) * 7)]}
              />
            </div>
          </div>
          <div className={styles.cell}>
            <Text className={styles.cellHeader} {...headerProps}>
              Anomalies
            </Text>
            <Text {...cellTextProps}>{openAnomalies} Open</Text>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.cell}>
            <Text className={styles.cellHeader} {...headerProps}>
              Deployment
            </Text>
            <Text {...cellTextProps}>{`${verificationPassed} passed ${verificationFailed} failed`}</Text>
          </div>
          <div className={styles.cell}>
            <Text className={styles.cellHeader} {...headerProps}>
              Change Events
            </Text>
            <Text {...cellTextProps}>{`${changeEventsPassed} passed ${changeEventsFailed} failed`}</Text>
          </div>
        </div>
      </div>
    </Card>
  )
}
