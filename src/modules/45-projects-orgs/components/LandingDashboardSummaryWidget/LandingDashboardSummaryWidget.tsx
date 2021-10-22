import React, { useEffect, useState } from 'react'
import { Card, Color, Container, FontVariation, Icon, IconName, Layout, Text } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import cx from 'classnames'
import { TimeRangeToDays, useLandingDashboardContext } from '@common/factories/LandingDashboardContext'
import { useStrings } from 'framework/strings'
import { ModuleName } from 'framework/types/ModuleName'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import {
  StackedSummaryInterface,
  StackedSummaryTable
} from '@common/components/StackedSummaryTable/StackedSummaryTable'
import {
  TopProjectsDashboardInfoCountWithSuccessFailureDetails,
  TopProjectsPanel,
  useGetTopProjects
} from 'services/dashboard-service'
import { getStackedSummaryBarCount } from '@common/components/StackedSummaryBar/StackedSummaryBar'
import type { StringsMap } from 'stringTypes'
import routes from '@common/RouteDefinitions'
import DashboardNoDataWidget from '@projects-orgs/components/DashboardNoDataWidget/DashboardNoDataWidget'
import DashboardAPIErrorWidget, {
  DashboardAPIErrorWidgetProps
} from '@projects-orgs/components/DashboardAPIErrorWidget/DashboardAPIErrorWidget'
import TimeRangeSelect from '@projects-orgs/components/TimeRangeSelect/TimeRangeSelect'

import OverviewGlanceCards from '@projects-orgs/components/OverviewGlanceCards/OverviewGlanceCards'
import css from './LandingDashboardSummaryWidget.module.scss'

const getModuleSummaryHeader = (iconName: IconName, title: string): JSX.Element | string => {
  return (
    <Layout.Horizontal spacing="small" margin={{ left: 'large' }} className={'summaryTableHeader'}>
      <Icon name={iconName}></Icon>
      <Text font={{ variation: FontVariation.TABLE_HEADERS }}>{title}</Text>
    </Layout.Horizontal>
  )
}

const formatSummaryData = (
  response: Array<TopProjectsDashboardInfoCountWithSuccessFailureDetails>
): Array<StackedSummaryInterface> => {
  const formattedData = response.map(projectData => {
    const { projectInfo, countDetails } = projectData
    const { successCount = 0, failureCount = 0, countChangeAndCountChangeRateInfo } = countDetails || {}

    const stackData: StackedSummaryInterface = {
      label: projectInfo?.projectName || '',
      barSectionsData: [
        { count: successCount, color: Color.PRIMARY_6 },
        { count: failureCount, color: Color.RED_500 }
      ]
    }

    const countTrend = countChangeAndCountChangeRateInfo?.countChange
    if (countTrend) {
      stackData.trend = countTrend.toString()
    }
    return stackData
  })

  return formattedData.sort?.(
    (a, b) => getStackedSummaryBarCount(b.barSectionsData) - getStackedSummaryBarCount(a.barSectionsData)
  )
}

const renderModuleSummary = (
  responseData: TopProjectsPanel | undefined,
  dataKey: keyof TopProjectsPanel | undefined,
  accountId: string,
  strings: Record<string, string>,
  iconName: IconName,
  refetch: DashboardAPIErrorWidgetProps['callback']
): JSX.Element => {
  return dataKey && responseData?.[dataKey]?.executionStatus === 'SUCCESS' ? (
    responseData?.[dataKey]?.response?.length ? (
      <StackedSummaryTable
        columnHeaders={[strings.projectText, getModuleSummaryHeader(iconName, strings.title)]}
        summaryData={formatSummaryData(
          responseData?.[dataKey]?.response as TopProjectsDashboardInfoCountWithSuccessFailureDetails[]
        )}
      ></StackedSummaryTable>
    ) : (
      <DashboardNoDataWidget
        className={'glanceModuleErrorWrapper'}
        label={
          <Text font={{ variation: FontVariation.BODY }} margin="small">
            {strings.noDeployments}
          </Text>
        }
        iconProps={{ size: 100 }}
        getStartedLink={routes.toCDHome({ accountId })}
      ></DashboardNoDataWidget>
    )
  ) : (
    <DashboardAPIErrorWidget
      className={'glanceModuleErrorWrapper'}
      callback={refetch}
      iconProps={{ size: 80 }}
    ></DashboardAPIErrorWidget>
  )
}

interface ModuleDataType {
  iconName: IconName
  titleId: keyof StringsMap
  dataKey?: keyof TopProjectsPanel
}

const getModuleData = (moduleType: ModuleName): ModuleDataType => {
  switch (moduleType) {
    case ModuleName.CD:
      return {
        iconName: 'cd-main',
        titleId: 'deploymentsText',
        dataKey: 'cdtopProjectsInfo'
      }
    case ModuleName.CI:
      return {
        iconName: 'ci-main',
        titleId: 'buildsText',
        dataKey: 'citopProjectsInfo'
      }

    case ModuleName.CF:
      return {
        iconName: 'cf-main',
        titleId: 'common.purpose.cf.continuous',
        dataKey: 'cftopProjectsInfo'
      }
    default:
      return {
        iconName: 'placeholder',
        titleId: 'na'
      }
  }
}

const LandingDashboardSummaryWidget: React.FC = () => {
  const { selectedTimeRange } = useLandingDashboardContext()
  const { accountId } = useParams<ProjectPathProps>()
  const [range] = useState([Date.now() - TimeRangeToDays[selectedTimeRange] * 24 * 60 * 60000, Date.now()])
  const { getString } = useStrings()

  const {
    data: response,
    loading,
    error,
    refetch
  } = useGetTopProjects({
    queryParams: {
      accountIdentifier: accountId,
      startTime: range[0],
      endTime: range[1]
    },
    lazy: true
  })

  useEffect(() => {
    refetch()
  }, [selectedTimeRange, refetch])

  const { iconName, titleId, dataKey } = getModuleData(ModuleName.CD)

  return (
    <div className={css.dashboardSumary}>
      <TimeRangeSelect className={css.timeRangeSelect} />
      <Layout.Horizontal className={css.atGlanceWrapper} spacing="large">
        <OverviewGlanceCards />
        <Card className={css.topProjectsCard}>
          <Layout.Vertical className={css.topProjectsContainer}>
            <Text font={{ variation: FontVariation.CARD_TITLE }}>
              {getString('projectsOrgs.landingDashboard.title')}
            </Text>
            {loading ? (
              <Container flex className={cx(css.topProjectsWrapper, { [css.loadingProjects]: !!loading })}>
                <Icon name="spinner" size={24} color={Color.PRIMARY_7} flex={{ alignItems: 'center' }} />
              </Container>
            ) : !error && response?.data?.executionStatus === 'SUCCESS' ? (
              <Layout.Horizontal className={css.topProjectsWrapper}>
                {renderModuleSummary(
                  response.data?.response,
                  dataKey,
                  accountId,
                  {
                    projectText: getString('projectsText'),
                    title: getString(titleId),
                    noDeployments: getString('common.noDeployments')
                  },
                  iconName,
                  refetch
                )}

                {/* This is temporary handling till support for CI, CF modules are added */}
                <Layout.Vertical className={css.comingSoon} flex={{ justifyContent: 'center' }}>
                  <Icon name="ci-main" size={40} margin="small" />
                  <Text>{getString('common.comingSoon')}</Text>
                </Layout.Vertical>

                <Layout.Vertical className={css.comingSoon} flex={{ justifyContent: 'center' }}>
                  <Icon name="cf-main" size={40} margin="small" />
                  <Text>{getString('common.comingSoon')}</Text>
                </Layout.Vertical>
              </Layout.Horizontal>
            ) : (
              <DashboardAPIErrorWidget
                className={css.topProjectsWrapper}
                callback={refetch}
                iconProps={{ size: 90 }}
              ></DashboardAPIErrorWidget>
            )}
          </Layout.Vertical>
        </Card>
      </Layout.Horizontal>
    </div>
  )
}

export default LandingDashboardSummaryWidget
