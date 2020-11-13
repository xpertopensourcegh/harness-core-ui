import React, { useMemo } from 'react'
import { Container, Text, Icon, Color } from '@wings-software/uikit'
import type { FontProps } from '@wings-software/uikit/dist/styled-props/font/FontProps'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import classnames from 'classnames'
import moment from 'moment'
import merge from 'lodash-es/merge'
import styles from './TimeseriesRow.module.scss'

export interface SeriesConfig {
  name?: string
  series: Highcharts.SeriesLineOptions[]
}

export interface TimeseriesRowProps {
  transactionName: React.ReactNode
  metricName?: React.ReactNode
  seriesData: Array<SeriesConfig>
  chartOptions?: Highcharts.Options
  hideShowMore?: boolean // temporary - this will likely become click callback
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
  chartOptions,
  hideShowMore
}: TimeseriesRowProps) {
  const rows = useMemo(() => {
    return seriesData.map(data => ({
      name: data.name,
      options: chartOptions ? merge(chartsConfig(data.series), chartOptions) : chartsConfig(data.series)
    }))
  }, [seriesData, chartOptions])
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
        {rows.map((data, index) => (
          <React.Fragment key={index}>
            {data.name && <Text>{data.name}</Text>}
            <Container className={styles.chartRow}>
              <Container className={styles.chartContainer}>
                <HighchartsReact highcharts={Highcharts} options={data.options} />
              </Container>
              {!hideShowMore && <Icon name="main-more" className={styles.verticalMoreIcon} color={Color.GREY_350} />}
            </Container>
          </React.Fragment>
        ))}
      </Container>
    </Container>
  )
}

export function chartsConfig(series: Highcharts.SeriesLineOptions[]): Highcharts.Options {
  return {
    chart: {
      backgroundColor: 'transparent',
      height: 40,
      type: 'line',
      spacing: [5, 2, 5, 2]
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
        return `<section class="serviceeGuardTimeSeriesTooltip"><p>${moment(this.x).format(
          'M/D/YYYY h:mm a'
        )}</p><br/><p>Value: ${this.y}</p></section>`
      },
      outside: true
    },
    subtitle: undefined,
    series
  }
}
