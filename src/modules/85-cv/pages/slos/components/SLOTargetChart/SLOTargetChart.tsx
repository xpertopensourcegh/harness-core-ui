import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { merge, debounce } from 'lodash-es'
import type Highcharts from 'highcharts'
import { Container, Icon, Color, PageError, Text, FontVariation } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import { useGetSliGraph, ServiceLevelIndicatorDTO, TimeGraphResponse } from 'services/cv'
import { TimeSeriesAreaChart } from '@common/components'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { getErrorMessage } from '@cv/utils/CommonUtils'
import { SLIMetricTypes } from '@cv/pages/slos/components/CVCreateSLO/CVCreateSLO.types'
import { getDefaultChartOptions } from './SLOTargetChart.utils'
import { convertServiceLevelIndicatorToSLIFormData } from '../CVCreateSLO/CVCreateSLO.utils'

interface SLOTargetChartProps {
  topLabel?: JSX.Element
  bottomLabel?: JSX.Element
  customChartOptions?: Highcharts.Options
  serviceLevelIndicator: ServiceLevelIndicatorDTO
  monitoredServiceIdentifier?: string
  debounceWait?: number
}

const SLOTargetChart: React.FC<SLOTargetChartProps> = ({
  topLabel,
  bottomLabel,
  customChartOptions = {},
  monitoredServiceIdentifier = '',
  serviceLevelIndicator,
  debounceWait
}) => {
  const { getString } = useStrings()
  const { accountId, orgIdentifier, projectIdentifier } = useParams<ProjectPathProps>()
  const sliFormData = convertServiceLevelIndicatorToSLIFormData(serviceLevelIndicator)

  const [sliGraphData, setSliGraphData] = useState<TimeGraphResponse>()

  const finalChartOptions = useMemo(() => merge(getDefaultChartOptions(), customChartOptions), [customChartOptions])

  const { mutate, loading, error } = useGetSliGraph({
    monitoredServiceIdentifier,
    queryParams: {
      accountId,
      orgIdentifier,
      projectIdentifier
    }
  })

  useEffect(() => {
    setSliGraphData(undefined)
  }, [sliFormData.SLIMetricType])

  const fetchSliGraphData = async (_serviceLevelIndicator: ServiceLevelIndicatorDTO): Promise<void> => {
    try {
      const sliGraphResponseData = await mutate(_serviceLevelIndicator)

      setSliGraphData(sliGraphResponseData.resource)
    } catch (e) {
      //
    }
  }

  const debounceFetchSliGraphData = useCallback(debounce(fetchSliGraphData, debounceWait), [])

  useEffect(() => {
    debounceFetchSliGraphData(serviceLevelIndicator)
  }, [...Object.values(sliFormData)])

  if (loading) {
    return (
      <Container flex={{ justifyContent: 'center' }} height="100%">
        <Icon name="steps-spinner" color={Color.GREY_400} size={30} />
      </Container>
    )
  }

  if (error) {
    return (
      <PageError
        width={400}
        message={getErrorMessage(error)}
        onClick={() => fetchSliGraphData(serviceLevelIndicator)}
      />
    )
  }

  const seriesData: Omit<Highcharts.SeriesColumnOptions, 'type'>[] = [
    {
      data: sliGraphData?.dataPoints?.map(point => [Number(point.timeStamp) || 0, Number(point.value) || 0]),
      showInLegend: false
    }
  ]

  if (seriesData[0].data) {
    return (
      <div>
        {topLabel}
        <TimeSeriesAreaChart customChartOptions={finalChartOptions} seriesData={seriesData} />
        {bottomLabel}
      </div>
    )
  }

  return (
    <Container flex={{ justifyContent: 'center' }} height="100%">
      <Text font={{ variation: FontVariation.BODY }} color={Color.GREY_600}>
        {getString('cv.pleaseFillTheRequiredDataToSeeTheSLIData')}
      </Text>
    </Container>
  )
}

const SLOTargetChartWrapper: React.FC<SLOTargetChartProps> = props => {
  const { getString } = useStrings()
  const { serviceLevelIndicator, monitoredServiceIdentifier } = props

  const {
    healthSourceRef,
    SLIType,
    SLIMetricType,
    validRequestMetric,
    objectiveValue = -1,
    objectiveComparator,
    SLIMissingDataType,
    eventType,
    goodRequestMetric
  } = convertServiceLevelIndicatorToSLIFormData(serviceLevelIndicator)

  const emptyState = (
    <Container flex={{ justifyContent: 'center' }} height="100%">
      <Text font={{ variation: FontVariation.BODY }} color={Color.GREY_600}>
        {getString('cv.pleaseFillTheRequiredDataToSeeTheSLIData')}
      </Text>
    </Container>
  )

  if (
    monitoredServiceIdentifier &&
    healthSourceRef &&
    SLIType &&
    SLIMetricType &&
    validRequestMetric &&
    objectiveValue >= 0 &&
    objectiveValue <= 100 &&
    objectiveComparator &&
    SLIMissingDataType
  ) {
    if (SLIMetricType === SLIMetricTypes.RATIO) {
      if (!eventType || !goodRequestMetric || validRequestMetric === goodRequestMetric) {
        return emptyState
      }
    }

    return <SLOTargetChart {...props} />
  }

  return emptyState
}

export default SLOTargetChartWrapper
