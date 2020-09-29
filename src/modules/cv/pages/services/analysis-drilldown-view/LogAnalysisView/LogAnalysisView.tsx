import React, { useEffect, useMemo } from 'react'
import { Container, Text, Color } from '@wings-software/uikit'
import { routeParams } from 'framework/exports'
import { PageError } from 'modules/common/components/Page/PageError'
import { Frequency, useGetAllLogs } from 'services/cv'
import { NoDataCard } from 'modules/common/components/Page/NoDataCard'
import i18n from './LogAnalysisView.i18n'
import { LogAnalysisRow, LogAnalysisRowData } from './LogAnalysisRow/LogAnalysisRow'
import LogAnalysisFrequencyChart from './LogAnalysisFrequencyChart/LogAnalysisFrequencyChart'
import { categoryNameToCategoryType } from '../../CVServicePageUtils'
import css from './LogAnalysisView.module.scss'

interface LogAnalysisViewProps {
  startTime: number
  endTime: number
  environmentIdentifier?: string
  serviceIdentifier?: string
  categoryName?: string
  historyStartTime?: number
}

function generatePointsForLogFrequency(
  trend: Frequency[],
  startTime: number,
  endTime: number
): Highcharts.SeriesLineOptions[] {
  if (!trend || !Object.keys(trend).length) {
    return []
  }

  trend.sort((trendDataA, trendDataB) => {
    if (!trendDataA?.timestamp) {
      return trendDataB?.timestamp ? -1 : 0
    }
    if (!trendDataB?.timestamp) {
      return trendDataA.timestamp
    }

    return trendDataA.timestamp - trendDataB.timestamp
  })

  const filledMetricData = []
  let trendIndex = 0
  for (let currTime = startTime; currTime <= endTime; currTime += 60000) {
    if (trend[trendIndex]?.timestamp === currTime) {
      filledMetricData.push({ x: currTime, y: trend[trendIndex]?.count })
      trendIndex++
    } else {
      filledMetricData.push({ x: currTime, y: 0 })
    }
  }

  return [
    {
      type: 'line',
      name: 'Installation',
      data: filledMetricData,
      zoneAxis: 'x',
      zones: [
        // {
        //   value: data[Math.floor(Math.random() * 14)].x,
        //   color: 'var(--blue-500)'
        // },
        // {
        //   color: 'var(--red-500)'
        // }
      ]
    }
  ]
}

export default function LogAnalysisView(props: LogAnalysisViewProps): JSX.Element {
  const {
    params: { accountId, orgIdentifier, projectIdentifier }
  } = routeParams()
  const { environmentIdentifier, serviceIdentifier, startTime, endTime, categoryName, historyStartTime } = props
  const finalStartTime = historyStartTime ?? startTime
  const { error, data: logAnalysisResponse, refetch: refetchLogAnalysis } = useGetAllLogs({ lazy: true })
  const logAnalysisData = logAnalysisResponse?.resource?.content
  const logDataDTOs: LogAnalysisRowData[] = useMemo(() => {
    return (
      (logAnalysisData
        ?.map(d =>
          d?.logData
            ? {
                message: d.logData.text,
                clusterType: d.logData.tag,
                count: d.logData.count,
                messageFrequency: generatePointsForLogFrequency(d.logData.trend || [], startTime, endTime)
              }
            : undefined
        )
        .filter(l => !!l) as LogAnalysisRowData[]) || []
    )
  }, [logAnalysisData, startTime, endTime])

  const queryParams = useMemo(
    () => ({
      accountId,
      projectIdentifier: projectIdentifier as string,
      orgIdentifier: orgIdentifier as string,
      environmentIdentifier,
      serviceIdentifier,
      monitoringCategory: (categoryName ? categoryNameToCategoryType(categoryName) : undefined) as string,
      startTime,
      endTime
    }),
    [endTime, startTime, categoryName, serviceIdentifier, environmentIdentifier, projectIdentifier, orgIdentifier]
  )
  useEffect(() => {
    refetchLogAnalysis({ queryParams })
  }, [queryParams])

  if (error) {
    return <PageError message={error?.message} onClick={() => refetchLogAnalysis({ queryParams })} />
  }

  if (!logAnalysisResponse?.resource?.content?.length) {
    return (
      <Container style={{ position: 'relative', top: '45px' }}>
        <NoDataCard
          message={i18n.noDataText}
          buttonText={i18n.retryButtonText}
          icon="warning-sign"
          onClick={() => refetchLogAnalysis({ queryParams })}
          className={css.noDataCard}
        />
      </Container>
    )
  }

  return (
    <Container className={css.main}>
      <Container className={css.heading}>
        <Text
          color={Color.BLACK}
          className={css.clusterHeading}
        >{`${i18n.clusterHeading.firstHalf}${logAnalysisData?.length}${i18n.clusterHeading.secondHalf}`}</Text>
      </Container>
      <LogAnalysisFrequencyChart
        startTime={finalStartTime}
        endTime={endTime}
        environmentIdentifier={environmentIdentifier}
        serviceIdentifier={serviceIdentifier}
        categoryName={categoryName || ''}
      />
      <Container className={css.logContainer}>
        <LogAnalysisRow data={logDataDTOs} />
      </Container>
    </Container>
  )
}
