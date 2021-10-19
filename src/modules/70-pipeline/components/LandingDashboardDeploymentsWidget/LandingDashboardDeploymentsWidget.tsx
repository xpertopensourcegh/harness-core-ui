import React, { useMemo, useState, useEffect } from 'react'
import { Card, Color, Container, FontVariation, Icon, Layout, Select, Text } from '@wings-software/uicore' // Layout
import { useParams } from 'react-router-dom'
import { defaultTo, noop } from 'lodash-es'
import type { TooltipFormatterContextObject } from 'highcharts'
import { useLandingDashboardContext, TimeRangeToDays } from '@common/factories/LandingDashboardContext'
import { useStrings } from 'framework/strings'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { OverviewChartsWithToggle } from '@common/components/OverviewChartsWithToggle/OverviewChartsWithToggle'
import { StackedSummaryTable } from '@common/components/StackedSummaryTable/StackedSummaryTable'
import routes from '@common/RouteDefinitions'
import { useGetDeploymentStatsOverview } from 'services/dashboard-service'
import { useErrorHandler } from '@pipeline/components/Dashboards/shared'
import DashboardAPIErrorWidget from '@projects-orgs/components/DashboardAPIErrorWidget/DashboardAPIErrorWidget'
import DashboardNoDataWidget from '@projects-orgs/components/DashboardNoDataWidget/DashboardNoDataWidget'

import css from './LandingDashboardDeploymentsWidget.module.scss'

interface SummaryCardData {
  title: string
  count: string
  trend: string
}

const EmptyCard = ({ children }: { children: React.ReactElement }) => {
  return (
    <Layout.Horizontal className={css.loaderContainer}>
      <Card className={css.loaderCard}>{children}</Card>
    </Layout.Horizontal>
  )
}

const LandingDashboardDeploymentsWidget: React.FC = () => {
  const { getString } = useStrings()
  const { selectedTimeRange } = useLandingDashboardContext()
  const { accountId } = useParams<ProjectPathProps>()
  const [range] = useState([Date.now() - TimeRangeToDays[selectedTimeRange] * 24 * 60 * 60000, Date.now()])

  const { data, error, refetch, loading } = useGetDeploymentStatsOverview({
    queryParams: {
      accountIdentifier: accountId,
      startTime: range[0],
      endTime: range[1],
      groupBy: 'DAY',
      sortBy: 'DEPLOYMENTS'
    },
    lazy: true
  })

  const response = data?.data?.response
  useEffect(() => {
    refetch()
  }, [selectedTimeRange])

  useErrorHandler(error)

  const deploymentStatsData = useMemo(() => {
    const successData: number[] = []
    const failureData: number[] = []
    const custom: any = []
    if (response?.deploymentsStatsSummary?.deploymentStats?.length) {
      response.deploymentsStatsSummary.deploymentStats.forEach(val => {
        successData.push(defaultTo(val.countWithSuccessFailureDetails?.successCount, 0))
        failureData.push(defaultTo(val.countWithSuccessFailureDetails?.failureCount, 0))
        custom.push(val)
      })
    }
    return [
      {
        name: 'Failed',
        data: failureData,
        color: '#EE5F54',
        custom
      },
      {
        name: 'Success',
        data: successData,
        color: '#5FB34E',
        custom
      }
    ]
  }, [data])

  const summaryCardsData = useMemo(() => {
    return [
      {
        title: getString('deploymentsText'),
        count: `${response?.deploymentsStatsSummary?.countAndChangeRate?.count}`,
        trend: `${response?.deploymentsStatsSummary?.countAndChangeRate?.countChangeAndCountChangeRateInfo?.countChangeRate}%`
      },
      {
        title: getString('common.failureRate'),
        count: `${(response?.deploymentsStatsSummary?.failureRateAndChangeRate?.rate || 0).toFixed(2)}%`,
        trend: `${response?.deploymentsStatsSummary?.failureRateAndChangeRate?.rateChangeRate}%`
      },
      {
        title: getString('pipeline.deploymentFrequency'),
        count: `${(response?.deploymentsStatsSummary?.deploymentRateAndChangeRate?.rate || 0).toFixed(2)}`,
        trend: `${response?.deploymentsStatsSummary?.deploymentRateAndChangeRate?.rateChangeRate}%`
      }
    ]
  }, [data, getString])

  const mostActiveServicesData = useMemo(() => {
    return response?.mostActiveServicesList?.activeServices?.map(service => {
      return {
        label: defaultTo(service.serviceInfo?.serviceName, ''),
        barSectionsData: [
          { count: defaultTo(service.countWithSuccessFailureDetails?.successCount, 0), color: Color.GREEN_500 },
          { count: defaultTo(service.countWithSuccessFailureDetails?.failureCount, 0), color: Color.RED_500 }
        ],
        trend: `${service.countWithSuccessFailureDetails?.countChangeAndCountChangeRateInfo?.countChangeRate}%`
      }
    })
  }, [data])

  const summaryCardRenderer = (cardData: SummaryCardData): JSX.Element => {
    return (
      <Container className={css.summaryCard}>
        <Text font={{ size: 'medium' }} color={Color.GREY_700} className={css.cardTitle}>
          {cardData.title}
        </Text>
        <Layout.Horizontal>
          <Text color={Color.BLACK} font={{ size: 'large', weight: 'bold' }} className={css.frequencyCount}>
            {cardData.count}
          </Text>
          <Container className={css.trendContainer} flex>
            <Icon size={10} name={'symbol-triangle-up'} color={Color.GREEN_600} />
            <Text className={css.trend} color={Color.GREEN_600}>
              {cardData.trend}
            </Text>
          </Container>
        </Layout.Horizontal>
      </Container>
    )
  }

  const getSummaryCardRenderers = (): JSX.Element => {
    return (
      <Container className={css.summaryCardsContainer}>
        {summaryCardsData?.map(currData => summaryCardRenderer(currData))}
      </Container>
    )
  }

  const getTooltip = (currPoint: TooltipFormatterContextObject): string => {
    const custom = currPoint?.series?.userOptions?.custom
    const point = custom?.[currPoint.key]
    const time = point
      ? new Date(point.time).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })
      : currPoint.x

    return `<div style="padding: 16px; color: white; width: 282px; height: 128px;">
        <div style="display: flex; justify-content: space-between; border-bottom: 0.5px solid rgba(243, 243, 250); padding-bottom: 7px; margin-bottom: 15px;">
          <div style="font-weight: normal; font-size: 12px; line-height: 18px; opacity: 0.8;">${time}</div>
          <div>
            <span style="white-space: pre; font-weight: bold; font-size: 12px; line-height: 18px; opacity: 0.8;">Deployments: </span>
            <span style="font-weight: bold; font-size: 12px; line-height: 18px;">${currPoint.y}</span>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <div>
            <p style="font-weight: 500; font-size: 10px; line-height: 14px; letter-spacing: 0.2px; color: #D9DAE6; margin-bottom: 0px;">Failure Rate</p>
            <p style="font-weight: 600; font-size: 28px; line-height: 38px; color: #FBE6E4;">11.9%</p>
          </div>
          <div style="margin-right: 8px;">
            <div style="display: flex; align-items: center; margin-bottom: 6px;">
              <div style="height: 6px; width: 12px; background-color: #5FB34E; border-radius: 16px; display: inline-block; margin-right: 8px"></div>
              <span style="white-space: pre; font-weight: bold; font-size: 12px; line-height: 16px; letter-spacing: 0.2px; opacity: 0.8;">Success </span>
              <span style="font-weight: bold; font-size: 12px; line-height: 16px; letter-spacing: 0.2px;">${89}</span>
            </div>
            <div style="display: flex; align-items: center;">
              <div style="height: 6px; width: 12px; background-color: #EE5F54; border-radius: 16px; display: inline-block; margin-right: 8px"></div>
              <span style="white-space: pre; font-weight: bold; font-size: 12px; line-height: 18px; opacity: 0.8;">Failed </span>
              <span style="font-weight: bold; font-size: 12px; line-height: 18px;">${12}</span>
            </div>
          </div>
        </div>
      </div>`
  }

  const getBadge = (type: string, stat: any): JSX.Element | null => {
    switch (type) {
      case 'manualInterventionsCount':
        return (
          <div className={css.manualInterventionsBadge}>
            <Text className={css.badgeText}>{`${stat} Pending Manual Interventions`}</Text>
          </div>
        )
      case 'pendingApprovalsCount':
        return (
          <div className={css.manualInterventionsBadge}>
            <Text className={css.badgeText}>{`${stat} Pending Approvals`}</Text>
          </div>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <EmptyCard>
        <Icon name="spinner" size={24} color={Color.PRIMARY_7} />
      </EmptyCard>
    )
  }

  if (!response || error) {
    return (
      <EmptyCard>
        <DashboardAPIErrorWidget className={css.apiErrorWidget} callback={refetch} iconProps={{ size: 90 }} />
      </EmptyCard>
    )
  }

  if (!response.deploymentsStatsSummary?.countAndChangeRate?.count) {
    return (
      <EmptyCard>
        <DashboardNoDataWidget
          label={
            <Text color={Color.GREY_400} style={{ fontSize: '14px' }} margin="medium">
              {'No Deployments'}
            </Text>
          }
          getStartedLink={routes.toCDHome({ accountId })}
        />
      </EmptyCard>
    )
  }

  return (
    <div className={css.main}>
      <Card className={css.badgesContainer}>
        {response?.deploymentsOverview &&
          Object.keys(response?.deploymentsOverview).map(key =>
            // eslint-disable-next-line
            getBadge(key, (response?.deploymentsOverview as any)[key])
          )}
      </Card>
      <div className={css.chartCardsContainer}>
        <Card style={{ width: '65%' }} className={css.deploymentsChartContainer}>
          <OverviewChartsWithToggle
            data={defaultTo(deploymentStatsData, [])}
            summaryCards={getSummaryCardRenderers()}
            customChartOptions={{
              tooltip: {
                useHTML: true,
                formatter: function () {
                  return getTooltip(this)
                },
                backgroundColor: Color.BLACK,
                outside: true,
                borderColor: 'black'
              }
            }}
          ></OverviewChartsWithToggle>
        </Card>
        <Card className={css.mostActiveServicesChartContainer}>
          <Layout.Horizontal flex border={{ bottom: true }} height={54}>
            <Text font={{ variation: FontVariation.CARD_TITLE }} className={css.activeServicesTitle}>
              {getString('common.mostActiveServices')}
            </Text>
            <Select
              onChange={() => noop}
              items={[{ label: 'By Deployments', value: 'deployments' }]}
              className={css.servicesByDropdown}
              value={{ label: 'By Deployments', value: 'deployments' }}
            />
          </Layout.Horizontal>
          <StackedSummaryTable
            barLength={210}
            columnHeaders={['SERVICES', 'DEPLOYMENTS']}
            summaryData={defaultTo(mostActiveServicesData, [])}
          />
        </Card>
      </div>
    </div>
  )
}

export default LandingDashboardDeploymentsWidget
