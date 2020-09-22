import React, { useEffect, useMemo } from 'react'
import { Container, Text, Color } from '@wings-software/uikit'
import { routeParams } from 'framework/exports'
import { PageError } from 'modules/common/components/Page/PageError'
import { LogData, useGetAllLogs } from 'services/cv'
import { NoDataCard } from 'modules/common/components/Page/NoDataCard'
import i18n from './LogAnalysisView.i18n'
import { LogAnalysisRow } from './LogAnalysisRow/LogAnalysisRow'
import LogAnalysisFrequencyChart from './LogAnalysisFrequencyChart/LogAnalysisFrequencyChart'
import { categoryNameToCategoryType } from '../../CVServicePageUtils'
import css from './LogAnalysisView.module.scss'

interface LogAnalysisViewProps {
  startTime: number
  endTime: number
  environmentIdentifier?: string
  serviceIdentifier?: string
  categoryName?: string
}

export default function LogAnalysisView(props: LogAnalysisViewProps): JSX.Element {
  const {
    params: { accountId, orgIdentifier, projectIdentifier }
  } = routeParams()
  const { environmentIdentifier, serviceIdentifier, startTime, endTime, categoryName } = props
  const { error, data: logAnalysisResponse, refetch: refetchLogAnalysis } = useGetAllLogs({ lazy: true })
  const logAnalysisData = logAnalysisResponse?.resource?.content
  const logDataDTOs: LogData[] = useMemo(() => {
    return (logAnalysisData?.map(d => d.logData).filter(l => !!l) as LogData[]) || []
  }, [logAnalysisData])

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
    [endTime, startTime, categoryName, serviceIdentifier, environmentIdentifier]
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
        startTime={startTime}
        endTime={endTime}
        environmentIdentifier={environmentIdentifier}
        serviceIdentifier={serviceIdentifier}
        categoryName={categoryName || ''}
      />
      <Container className={css.logContainer}>
        <LogAnalysisRow data={logDataDTOs} startTime={startTime} endTime={endTime} />
      </Container>
    </Container>
  )
}
