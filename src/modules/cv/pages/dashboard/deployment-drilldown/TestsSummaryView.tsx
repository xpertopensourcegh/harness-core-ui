import React from 'react'
import { Container, Text } from '@wings-software/uikit'
import moment from 'moment'
import type { FontProps } from '@wings-software/uikit/dist/styled-props/font/FontProps'
import i18n from './DeploymentDrilldownView.i18n'
import styles from './TestsSummaryView.module.scss'

export interface TestsSummaryViewProps {
  baselineTestName: string
  baselineTestDate: number
  currentTestName: string
  currentTestDate: number
}

const defaultDateFormat = 'MMM D, YYYY h:mm A'

const fontSizeProps: FontProps = { size: 'medium' }
const fontWeightPros: FontProps = { weight: 'bold' }

export default function TestsSummaryView({
  baselineTestName,
  baselineTestDate,
  currentTestName,
  currentTestDate
}: TestsSummaryViewProps) {
  return (
    <Container className={styles.testsSummaryView}>
      <Container className={styles.baselineTest}>
        <Text font={fontSizeProps} className={styles.mainLabel}>
          {i18n.baselineTest}
        </Text>
        <Text font={fontWeightPros}>{baselineTestName}</Text>
        <Text font={fontWeightPros}>
          {i18n.testsRan}: {moment(baselineTestDate).format(defaultDateFormat)}
        </Text>
      </Container>
      <Container className={styles.separator} />
      <Container>
        <Text font={fontSizeProps} className={styles.mainLabel}>
          {i18n.currentTest}
        </Text>
        <Text font={fontWeightPros}>{currentTestName}</Text>
        <Text font={fontWeightPros}>
          {i18n.testsRan}: {moment(currentTestDate).format(defaultDateFormat)}
        </Text>
      </Container>
    </Container>
  )
}
