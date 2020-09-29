import { Container } from '@wings-software/uikit'
import React, { useEffect, useState } from 'react'
import type { SeriesColumnOptions } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import cx from 'classnames'
import { routeParams } from 'framework/exports'
import { RestResponseListLogDataByTag, useGetTagCount } from 'services/cv'
import getLogViewcolumnChartConfig from './LogViewColumnChartConfig'
import { categoryNameToCategoryType } from '../../../CVServicePageUtils'
import i18n from './LogAnalysisFrequencyChart.i18n'
import css from './LogAnalysisFrequencyChart.module.scss'

interface LogAnalysisFrequencyChartProps {
  environmentIdentifier?: string
  serviceIdentifier?: string
  categoryName: string
  startTime: number
  endTime: number
  className?: string
}

const FIVE_MINUTES_IN_MILLISECONDS = 1000 * 60 * 5

function generatePointsForLogChart(data: RestResponseListLogDataByTag, startTime: number, endTime: number): any {
  if (!data?.resource) {
    return data
  }

  const content = data.resource
  const columnChartData = [
    {
      type: 'column',
      name: i18n.dataCategoryNames.notAnomalous,
      data: [],
      color: 'var(--blue-500)'
    },
    {
      type: 'column',
      name: i18n.dataCategoryNames.anomalous,
      data: [],
      color: 'var(--red-600)'
    }
  ] as SeriesColumnOptions[]
  const categories = []

  content.sort((logDataA, logDataB) => {
    if (!logDataA?.timestamp) {
      return logDataB?.timestamp ? -1 : 0
    }
    if (!logDataB?.timestamp) {
      return 1
    }

    return logDataA?.timestamp - logDataB?.timestamp
  })

  const nearest5thMinute = new Date(
    Math.round(startTime / FIVE_MINUTES_IN_MILLISECONDS) * FIVE_MINUTES_IN_MILLISECONDS
  ).getTime()

  // set up categories(x axis) and the total number of data points
  for (let i = nearest5thMinute; i <= endTime; i += 300000) {
    categories.push(i)
    columnChartData[0]?.data?.push(0)
    columnChartData[1]?.data?.push(0)
  }

  let logDataIndex = 0
  for (let timestampIndex = 0; timestampIndex < categories.length; timestampIndex++) {
    const tagBuckets = content[logDataIndex]
    if (!tagBuckets?.countByTags?.length || tagBuckets?.timestamp !== categories[timestampIndex]) continue

    logDataIndex++
    for (const tag of tagBuckets.countByTags) {
      if (tag.tag === 'KNOWN') {
        const arr: number[] = columnChartData[0].data as number[]
        arr[timestampIndex] += tag.count || 0
      } else if (tag.tag) {
        const arr: number[] = columnChartData[1].data as number[]
        arr[timestampIndex] += tag.count || 0
      }
    }
  }

  return { columnChartData, categories }
}

export default function LogAnalysisFrequencyChart(props: LogAnalysisFrequencyChartProps): JSX.Element {
  const {
    params: { accountId, orgIdentifier, projectIdentifier }
  } = routeParams()
  const { environmentIdentifier, serviceIdentifier, categoryName, startTime, endTime, className } = props
  const { refetch } = useGetTagCount({
    lazy: true,
    resolve(response) {
      const { categories, columnChartData } = generatePointsForLogChart(response, startTime, endTime)
      setColumnChartOptions(getLogViewcolumnChartConfig(columnChartData, categories, startTime, endTime))
      return response
    }
  })
  const [columnChartOptions, setColumnChartOptions] = useState<Highcharts.Options | undefined>()

  useEffect(() => {
    refetch({
      queryParams: {
        accountId,
        orgIdentifier: orgIdentifier as string,
        projectIdentifier: projectIdentifier as string,
        monitoringCategory: (categoryName ? categoryNameToCategoryType(categoryName) : undefined) as string,
        startTime,
        endTime,
        environmentIdentifier,
        serviceIdentifier
      }
    })
  }, [startTime, endTime, categoryName, serviceIdentifier, environmentIdentifier])
  return (
    <Container className={cx(css.main, className)}>
      <HighchartsReact highcharts={Highcharts} options={columnChartOptions} />
    </Container>
  )
}
