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

const primaryFontProps: FontProps = { size: 'normal' }
const secondaryFontProps: FontProps = { weight: 'bold', size: 'small' }

export default function TestsSummaryView({
  baselineTestName,
  baselineTestDate,
  currentTestName,
  currentTestDate
}: TestsSummaryViewProps) {
  return (
    <Container className={styles.testsSummaryView}>
      <Container className={styles.baselineTest}>
        <Text font={primaryFontProps} className={styles.mainLabel}>
          {i18n.baselineTest}
        </Text>
        <Text font={secondaryFontProps}>{baselineTestName || 'none'}</Text>
        <Text font={secondaryFontProps}>
          {i18n.testsRan}: {(baselineTestDate && moment(baselineTestDate).format(defaultDateFormat)) || 'none'}
        </Text>
      </Container>
      <Container className={styles.separator} />
      <Container>
        <Text font={primaryFontProps} className={styles.mainLabel}>
          {i18n.currentTest}
        </Text>
        <Text font={secondaryFontProps}>{currentTestName || 'none'}</Text>
        <Text font={secondaryFontProps}>
          {i18n.testsRan}: {(currentTestDate && moment(currentTestDate).format(defaultDateFormat)) || 'none'}
        </Text>
      </Container>
    </Container>
  )
}
