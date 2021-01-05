import React from 'react'
import { Text, Container, Layout, Heading, FlexExpander, Color } from '@wings-software/uicore'
import cx from 'classnames'
import { useStrings } from 'framework/exports'
import type { TestReportSummary } from 'services/ti-service'
import { Duration } from '@common/exports'
import { renderFailureRate, TestStatus } from './TestsUtils'
import css from './BuildTests.module.scss'

const now = Date.now()

export const TestsOverview: React.FC<{ testOverviewData: TestReportSummary | null }> = ({ testOverviewData }) => {
  const { getString } = useStrings()

  if (!testOverviewData) {
    return null
  }

  const duration = testOverviewData?.duration_ms || 0
  const total = testOverviewData?.total_tests || 0
  const failedTests = (
    testOverviewData?.tests?.filter(({ status }) => status === TestStatus.FAILED || status === TestStatus.ERROR) || []
  ).length
  const failureRate = failedTests / (total || 1)
  const failureRateDisplay = renderFailureRate(failureRate) + `%`

  return (
    <Container className={css.leftContainer}>
      <Container className={cx(css.widget, css.overview)} padding="medium">
        <Container flex>
          <Heading level={2} font={{ weight: 'bold' }}>
            {getString('overview')}
          </Heading>
          <FlexExpander />
          <Duration
            color={Color.GREY_400}
            iconProps={{ color: Color.GREY_400 }}
            durationText=" "
            icon="time"
            startTime={now - duration}
            endTime={now}
          ></Duration>
        </Container>
        <Layout.Horizontal spacing="small" margin={{ top: 'medium', bottom: 'small' }}>
          <Text className={css.stats} width="40%" background={Color.GREY_100} padding="small">
            {getString('ci.testsReports.totalExecutedTest')}
            <span className={cx(css.statsNumber)}>{total}</span>
          </Text>
          <Text className={css.stats} width="30%" background={Color.RED_200} padding="small" color={Color.RED_800}>
            {getString('ci.testsReports.failedTests')}
            <span className={cx(css.statsNumber)}>{failedTests}</span>
          </Text>
          <Text className={css.stats} width="30%" background={Color.RED_200} padding="small" color={Color.RED_800}>
            {getString('ci.testsReports.failureRate')}
            <span className={cx(css.statsNumber)}>{failureRateDisplay}</span>
          </Text>
        </Layout.Horizontal>
        <Text className={css.overviewResultLabel} padding={{ top: 'medium', bottom: 'medium' }} color={Color.GREY_400}>
          {getString('ci.testsReports.resultLabel')}
        </Text>
        <Layout.Horizontal margin={{ bottom: 'medium' }} spacing="medium">
          <Text inline icon="stop" iconProps={{ size: 16, color: Color.ORANGE_500 }}>
            {getString('failed')}
          </Text>
          <Text inline icon="stop" iconProps={{ size: 16, color: Color.GREEN_450 }}>
            {getString('passed')}
          </Text>
          <Text inline icon="stop" iconProps={{ size: 16, color: Color.GREY_300 }}>
            {getString('ci.testsReports.skipped')}
          </Text>
        </Layout.Horizontal>
        <Container className={css.graphWrapper}>
          <Container className={css.graphContainer}>
            <ul className={css.graph}>
              {testOverviewData?.tests?.map((test, index) => (
                <li key={(test.name as string) + index} data-status={test.status}>
                  &nbsp;
                </li>
              ))}
            </ul>
          </Container>
        </Container>
      </Container>
    </Container>
  )
}
