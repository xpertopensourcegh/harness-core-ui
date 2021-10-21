import React, { useState, useEffect, useMemo } from 'react'
import { Container, Text, Layout } from '@wings-software/uicore'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import moment from 'moment'
import merge from 'lodash-es/merge'
import { Spinner } from '@blueprintjs/core'

import { useParams } from 'react-router-dom'
import { useGetBuildExecution } from 'services/ci'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useStrings } from 'framework/strings'
import { useErrorHandler, useRefetchCall } from '@pipeline/components/Dashboards/shared'
import NoDeployments from '../images/NoDeployments.svg'
import styles from './BuildExecutionsChart.module.scss'

export interface ExecutionsChartProps {
  titleText: React.ReactNode
  customTitleCls?: string
  data?: Array<{
    time?: number
    success?: number
    failed?: number
  }>
  loading: boolean
  range: number[]
  onRangeChange(val: number[]): void
  yAxisTitle: string
  successColor?: string
  isCIPage?: boolean
}

export default function BuildExecutionsChart(props: any) {
  const { isCIPage } = props
  const { getString } = useStrings()
  const { projectIdentifier, orgIdentifier, accountId } = useParams<ProjectPathProps>()
  const [range, setRange] = useState([Date.now() - 30 * 24 * 60 * 60000, Date.now()])

  const { data, loading, error, refetch } = useGetBuildExecution({
    queryParams: {
      accountIdentifier: accountId,
      projectIdentifier,
      orgIdentifier,
      startTime: range[0],
      endTime: range[1]
    }
  })

  useErrorHandler(error)
  const refetching = useRefetchCall(refetch, loading)

  const chartData = useMemo(() => {
    if (data?.data?.buildExecutionInfoList?.length) {
      return data.data.buildExecutionInfoList.map(val => ({
        time: val.time,
        success: val.builds!.success,
        failed: val.builds!.failed
      }))
    }
  }, [data])

  return (
    <ExecutionsChart
      titleText={getString('pipeline.dashboards.buildExecutions')}
      data={chartData}
      loading={loading && !refetching}
      range={range}
      onRangeChange={setRange}
      yAxisTitle="# of builds"
      isCIPage={isCIPage}
    />
  )
}

export function ExecutionsChart({
  titleText,
  data,
  loading,
  range,
  yAxisTitle,
  successColor,
  isCIPage,
  customTitleCls
}: ExecutionsChartProps) {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>(
    generateEmptyChartData(range[0], range[1], {
      yAxis: {
        title: { text: yAxisTitle }
      }
    })
  )
  const successful: number[] = []
  const failed: number[] = []
  const empty: number[] = []
  const xCategories: string[] = []
  useEffect(() => {
    if (data?.length) {
      let totalMax = data.reduce((acc, curr) => {
        return Math.max(curr.success! + curr.failed!, acc)
      }, 0)
      totalMax = Math.ceil(Math.max(totalMax * 1.2, 10))
      data.forEach(val => {
        successful.push(val.success!)
        failed.push(val.failed!)
        empty.push(totalMax - val.success! - val.failed!)
        xCategories.push(moment(val.time).format('YYYY-MM-DD'))
      })
      setChartOptions(
        merge({}, defaultChartOptions, {
          chart: {
            animation: false
          },
          yAxis: {
            endOnTick: false,
            title: {
              text: yAxisTitle
            }
          },
          xAxis: {
            categories: xCategories
          },
          series: [
            {
              type: 'column',
              name: 'empty',
              color: 'var(--ci-color-gray-100)',
              showInLegend: false,
              enableMouseTracking: false,
              data: empty
            },
            {
              type: 'column',
              name: 'Failed',
              color: 'var(--ci-color-red-500)',
              data: failed,
              legendIndex: 1
            },
            {
              type: 'column',
              name: 'Successful',
              color: successColor || 'var(--ci-color-green-500)',
              data: successful,
              legendIndex: 0
            }
          ]
        })
      )
    }
  }, [data])
  const titleCls = customTitleCls ? styles.rangeSelectorHeader : ''
  const { getString } = useStrings()
  const failedData = chartOptions?.series?.find(item => item.name === 'Failed') as any
  const failedCount = failedData?.data?.every((item: any) => item === 0)

  const successData = chartOptions?.series?.find(item => item.name === 'Successful') as any
  const successCount = successData?.data?.every((item: any) => item === 0)

  return (
    <Container className={styles.main}>
      <Layout.Horizontal>
        <Text margin={{ right: 'small' }} className={titleCls}>
          {titleText}
        </Text>
        {loading && <Spinner size={15} />}
      </Layout.Horizontal>

      {isCIPage ? (
        <Container className={styles.chartWrapper}>
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </Container>
      ) : (!failedData && !successData) || (failedCount && successCount) ? (
        <Container className={styles.emptyView}>
          <Container className={styles.emptyViewCard}>
            <img src={NoDeployments} />
            <Text>{getString('pipeline.dashboards.noDeployments')}</Text>
          </Container>
        </Container>
      ) : (
        <Container className={styles.chartWrapper}>
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </Container>
      )}
    </Container>
  )
}

function generateEmptyChartData(start: number, end: number, config: Highcharts.Options): Highcharts.Options {
  let n = moment(end).diff(start, 'days')
  const empty: number[] = []
  const xCategories: string[] = []
  while (n-- > 0) {
    xCategories.push(moment().subtract(n, 'days').format('YYYY-MM-DD'))
    empty.push(10)
  }
  return merge({}, defaultChartOptions, config, {
    xAxis: {
      labels: { enabled: false },
      categories: xCategories
    },
    yAxis: {
      labels: { enabled: false }
    },
    series: [
      {
        type: 'column',
        name: 'nn',
        color: 'var(--ci-color-gray-100)',
        showInLegend: false,
        enableMouseTracking: false,
        data: empty
      }
    ]
  })
}

const defaultChartOptions: Highcharts.Options = {
  chart: {
    type: 'column',
    height: 215
  },
  title: {
    text: ''
  },
  credits: undefined,
  legend: {
    align: 'right',
    verticalAlign: 'top',
    symbolHeight: 12,
    symbolWidth: 19,
    symbolRadius: 7,
    squareSymbol: false,
    itemStyle: {
      fontWeight: '400',
      fontSize: '10',
      fontFamily: 'Inter, sans-serif'
    }
  },
  xAxis: {
    title: {
      text: 'Date',
      style: {
        fontSize: '8',
        color: '#9293AB'
      }
    },
    labels: {
      enabled: true,
      // autoRotation: false,
      formatter: lab => moment(lab.value).date() + '',
      style: {
        fontSize: '8',
        color: '#9293AB'
      }
    },
    tickWidth: 0,
    lineWidth: 0
  },
  yAxis: {
    labels: {
      enabled: true,
      style: {
        fontSize: '8',
        color: '#9293AB'
      }
    },
    title: {
      text: '',
      style: {
        fontSize: '8',
        color: '#9293AB'
      }
    },
    gridLineWidth: 0,
    lineWidth: 0
  },
  plotOptions: {
    column: {
      stacking: 'normal',
      pointPadding: 0,
      borderWidth: 3,
      borderRadius: 4,
      pointWidth: 6,
      events: {
        legendItemClick: function () {
          return false
        }
      }
    }
  }
}
