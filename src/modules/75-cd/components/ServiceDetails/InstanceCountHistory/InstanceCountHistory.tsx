import React, { useContext, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Color, Container, Layout, Text } from '@wings-software/uicore'
import type { ProjectPathProps, ServicePathProps } from '@common/interfaces/RouteInterfaces'
import { GetInstanceCountHistoryQueryParams, useGetInstanceCountHistory } from 'services/cd-ng'
import { DeploymentsTimeRangeContext } from '@cd/components/Services/common'
import { useStrings } from 'framework/strings'
import { PageSpinner, TimeSeriesAreaChart } from '@common/components'
import type { TimeSeriesAreaChartProps } from '@common/components/TimeSeriesAreaChart/TimeSeriesAreaChart'
import { PageError } from '@common/components/Page/PageError'
import MostActiveServicesEmptyState from '@cd/icons/MostActiveServicesEmptyState.svg'
import css from '@cd/components/ServiceDetails/InstanceCountHistory/InstanceCountHistory.module.scss'

const instanceCountHistoryChartColors = ['#9CCC65', '#47D5DF', '#AE82FC', '#FFA86B', '#0BB6FF']

export const InstanceCountHistory: React.FC = () => {
  const { accountId, orgIdentifier, projectIdentifier, serviceId } = useParams<ProjectPathProps & ServicePathProps>()
  const { timeRange } = useContext(DeploymentsTimeRangeContext)
  const { getString } = useStrings()

  const queryParams: GetInstanceCountHistoryQueryParams = {
    accountIdentifier: accountId,
    orgIdentifier,
    projectIdentifier,
    serviceId,
    startTime: timeRange?.range[0]?.getTime() || 0,
    endTime: timeRange?.range[1]?.getTime() || 0
  }
  const { loading, data, error, refetch } = useGetInstanceCountHistory({ queryParams })

  const seriesData: TimeSeriesAreaChartProps['seriesData'] = useMemo(() => {
    const envMap: Record<string, { x: number; y: number }[]> = {}
    data?.data?.timeValuePairList?.forEach(timeValuePair => {
      const envId = timeValuePair.value?.envId
      if (!envId) {
        return
      }
      if (!envMap[envId]) {
        envMap[envId] = []
      }
      envMap[envId].push({
        x: timeValuePair.timestamp || 0,
        y: timeValuePair.value?.count || 0
      })
    })
    return Object.values(envMap)
      .slice(0, 49) // Todo - Jasmeet - Handle UX for more than 50 series
      .map((envSeries, index) => ({
        data: envSeries.sort((valA, valB) => valA.x - valB.x),
        color: instanceCountHistoryChartColors[index % instanceCountHistoryChartColors.length]
      }))
  }, [data])

  const customChartOptions: Highcharts.Options = useMemo(
    () => ({
      chart: { height: 220, spacing: [25, 0, 25, 0] },
      legend: { enabled: false },
      xAxis: {
        allowDecimals: false,
        labels: {
          enabled: false
        }
      },
      yAxis: {
        max: Math.max(...(data?.data?.timeValuePairList || []).map(timeValuePair => timeValuePair.value?.count || 0))
      },
      plotOptions: {
        area: {
          pointStart: 0,
          animation: false
        }
      }
    }),
    [data]
  )

  const getComponent = (): React.ReactElement => {
    if (loading) {
      return <PageSpinner />
    }
    if (error) {
      return <PageError onClick={() => refetch()} />
    }
    if (!data?.data?.timeValuePairList?.length) {
      return (
        <Layout.Vertical height="100%" flex={{ align: 'center-center' }}>
          <Container margin={{ bottom: 'medium' }}>
            <img width="50" height="50" src={MostActiveServicesEmptyState} style={{ alignSelf: 'center' }} />
          </Container>
          <Text color={Color.GREY_400}>
            {getString('cd.serviceDashboard.noServiceInstances', {
              timeRange: timeRange?.label
            })}
          </Text>
        </Layout.Vertical>
      )
    }
    return <TimeSeriesAreaChart seriesData={seriesData} customChartOptions={customChartOptions} />
  }

  return (
    <Card className={css.instanceCountHistory}>
      <Text font={{ weight: 'semi-bold' }} color={Color.GREY_600} margin={{ bottom: 'small' }}>
        {getString('cd.serviceDashboard.instanceCountHistory')}
      </Text>
      {getComponent()}
    </Card>
  )
}
