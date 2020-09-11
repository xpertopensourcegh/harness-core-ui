import React, { useState, useEffect, useMemo } from 'react'
import { Container, Icon, Color, Pagination, Button } from '@wings-software/uikit'
import cx from 'classnames'
import { routeParams } from 'framework/exports'
import { useGetAnomalousMetricData, TimeSeriesMetricDataDTO, useGetMetricData } from 'services/cv'
import { NoDataCard } from 'modules/common/components/Page/NoDataCard'
import MetricAnalysisRow from './MetricsAnalysisRow/MetricAnalysisRow'
import { MetricAnalysisFilter } from './MetricAnalysisFilter/MetricAnalysisFilter'
import i18n from './MetricAnalysisView.i18n'
import css from './MetricAnalysisView.module.scss'

interface MetricAnalysisViewProps {
  startTime: number
  endTime: number
  categoryName: string
  environmentIdentifier?: string
  serviceIdentifier?: string
  className?: string
}

function categoryNameToEnum(categoryName: string): TimeSeriesMetricDataDTO['category'] {
  switch (categoryName) {
    case 'Performance':
      return 'PERFORMANCE'
    case 'Quality':
      return 'QUALITY'
    case 'Resources':
      return 'RESOURCES'
  }
}

export default function MetricAnalysisView(props: MetricAnalysisViewProps): JSX.Element {
  const { className, startTime, endTime, categoryName, environmentIdentifier, serviceIdentifier } = props
  const {
    params: { orgIdentifier = '', projectIdentifier = '', accountId = '' }
  } = routeParams()
  const queryParams = useMemo(
    () => ({
      accountId,
      orgIdentifier: orgIdentifier as string,
      projectIdentifier: projectIdentifier as string,
      environmentIdentifier,
      serviceIdentifier,
      monitoringCategory: categoryNameToEnum(categoryName),
      startTime,
      endTime
    }),
    [serviceIdentifier, environmentIdentifier, startTime, endTime, categoryName]
  )
  const [isViewingAnomalousData, setMetricDataView] = useState(true)
  const [needsRefetch, setNeedsRefetch] = useState(true)

  const {
    data: anomalousMetricData,
    error: anomalousError,
    loading: loadingAnomalousData,
    cancel: cancelAnomalousCall,
    refetch: refetchAnomalousData
  } = useGetAnomalousMetricData({
    queryParams,
    lazy: true
  })
  const {
    data: allMetricData,
    error: allMetricDataError,
    loading: loadingAllMetricData,
    cancel: cancelAllMetricDataCall,
    refetch: refetchAllMetricData
  } = useGetMetricData({ queryParams, lazy: true })

  useEffect(() => {
    if (isViewingAnomalousData) {
      refetchAnomalousData({ queryParams })
    } else {
      refetchAllMetricData({ queryParams })
    }
    setNeedsRefetch(true)
  }, [queryParams])

  if (allMetricDataError || anomalousError) {
    return (
      <Container className={css.errorOrLoading} margin="medium">
        <Icon name="error" size={25} color={Color.RED_500} />
        <Button intent="primary">{i18n.retryButtonText}</Button>
      </Container>
    )
  }

  const data = isViewingAnomalousData ? anomalousMetricData : allMetricData
  const { pageSize, pageCount = 0, content, itemCount = 0 } = data?.resource || {}

  return (
    <Container className={cx(css.main, className)}>
      <MetricAnalysisFilter
        onChangeFilter={() => {
          cancelAllMetricDataCall()
          cancelAnomalousCall()
          setMetricDataView(prevView => {
            const isAnomalousView = !prevView
            if (isAnomalousView && (!anomalousMetricData?.resource?.content?.length || needsRefetch)) {
              refetchAnomalousData()
              setNeedsRefetch(false)
            } else if (!allMetricData?.resource?.content?.length || needsRefetch) {
              refetchAllMetricData()
              setNeedsRefetch(false)
            }
            return isAnomalousView
          })
        }}
      />
      {(loadingAllMetricData || loadingAnomalousData) && (
        <Container className={css.errorOrLoading} margin="medium">
          <Icon name="steps-spinner" size={25} color={Color.GREY_600} />
        </Container>
      )}
      {!loadingAllMetricData && !loadingAnomalousData && !itemCount && (
        <NoDataCard
          message={isViewingAnomalousData ? i18n.noDataText.anomalous : i18n.noDataText.allMetricData}
          icon="deployment-success-legacy"
          buttonText={i18n.retryButtonText}
          onClick={isViewingAnomalousData ? () => refetchAnomalousData() : () => refetchAllMetricData()}
        />
      )}
      {!loadingAllMetricData &&
        !loadingAnomalousData &&
        content?.map((d: TimeSeriesMetricDataDTO) => {
          const { category, groupName, metricDataList, metricName } = d
          return metricName && category && groupName && metricDataList?.length ? (
            <MetricAnalysisRow
              key={`${categoryName}-${groupName}-${metricName}`}
              metricName={metricName}
              categoryName={category}
              transactionName={groupName}
              analysisData={metricDataList}
            />
          ) : null
        })}
      {pageSize && (
        <Pagination
          pageSize={pageSize}
          pageCount={pageCount}
          itemCount={itemCount}
          gotoPage={(pageIndex: number) => {
            if (isViewingAnomalousData) {
              refetchAnomalousData({ queryParams: { ...queryParams, page: pageIndex } })
            } else {
              refetchAllMetricData({ queryParams: { ...queryParams, page: pageIndex } })
            }
          }}
        />
      )}
    </Container>
  )
}
