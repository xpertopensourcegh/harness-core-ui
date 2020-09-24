import React from 'react'
import { Container, Text, Icon, Color } from '@wings-software/uikit'
import type { FontProps } from '@wings-software/uikit/dist/styled-props/font/FontProps'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import classnames from 'classnames'
import styles from './TimeseriesRow.module.scss'

export interface SeriesConfig {
  name?: string
  series: Highcharts.SeriesLineOptions[]
}

export interface TimeseriesRowProps {
  transactionName: React.ReactNode
  metricName?: React.ReactNode
  seriesData: Array<SeriesConfig>
  chartHeight?: number
  className?: string
}

const FONT_SIZE_SMALL: FontProps = {
  size: 'small'
}

export default function TimeseriesRow({
  transactionName,
  metricName,
  seriesData,
  className,
  chartHeight
}: TimeseriesRowProps) {
  return (
    <Container className={classnames(styles.timeseriesRow, className)}>
      <Container className={styles.labels}>
        <div>
          <div>
            <Text color={Color.BLACK} font={FONT_SIZE_SMALL} width={130} lineClamp={1}>
              {transactionName}
            </Text>
            <Text font={FONT_SIZE_SMALL} width={130} lineClamp={1}>
              {metricName}
            </Text>
          </div>
          <Icon name="star-empty" color={Color.GREY_250} />
        </div>
      </Container>
      <Container className={styles.charts}>
        {seriesData.map((data, index) => (
          <React.Fragment key={index}>
            {data.name && <Text>{data.name}</Text>}
            <Container className={styles.chartRow}>
              <Container className={styles.chartContainer}>
                <HighchartsReact highcharts={Highcharts} options={chartsConfig(data.series, chartHeight)} />
              </Container>
              <Icon name="main-more" className={styles.verticalMoreIcon} color={Color.GREY_350} />
            </Container>
          </React.Fragment>
        ))}
      </Container>
    </Container>
  )
}

function chartsConfig(series: Highcharts.SeriesLineOptions[], chartHeight?: number): Highcharts.Options {
  return {
    chart: {
      backgroundColor: '#FCFCFC',
      height: chartHeight || 40,
      type: 'line',
      spacing: [5, 5, 5, 5]
    },
    credits: undefined,
    title: {
      text: ''
    },
    legend: {
      enabled: false
    },
    xAxis: {
      labels: { enabled: false },
      lineWidth: 0,
      tickLength: 0,
      gridLineWidth: 0,
      title: {
        text: ''
      }
    },
    yAxis: {
      labels: { enabled: false },
      lineWidth: 0,
      tickLength: 0,
      gridLineWidth: 0,
      title: {
        text: ''
      }
    },
    plotOptions: {
      series: {
        stickyTracking: false,
        lineWidth: 1,
        turboThreshold: 50000
      },
      line: {
        marker: {
          enabled: false
        }
      }
    },
    tooltip: {
      formatter: function tooltipFormatter(this: any): string {
        // return `<section class="serviceeGuardTimeSeriesTooltip"><p>${new Date(this.x)}</p><br/><p>Value: ${
        //   this.y
        // }</p></section>`
        return `<p>${this.y}</p>`
      },
      outside: true
    },
    subtitle: undefined,
    series
  }
}
