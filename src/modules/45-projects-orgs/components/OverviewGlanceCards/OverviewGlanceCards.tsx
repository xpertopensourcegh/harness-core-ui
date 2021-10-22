import React, { useEffect, useState } from 'react'
import { Card, Color, Icon, Layout } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import GlanceCard, { GlanceCardProps } from '@common/components/GlanceCard/GlanceCard'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { CountChangeDetails, ResponseExecutionResponseCountOverview, useGetCounts } from 'services/dashboard-service'
import { TimeRangeToDays, useLandingDashboardContext } from '@common/factories/LandingDashboardContext'
import { useStrings } from 'framework/strings'
import type { StringsMap } from 'stringTypes'
import type { UseGetMockData } from '@common/utils/testUtils'
import DashboardAPIErrorWidget from '../DashboardAPIErrorWidget/DashboardAPIErrorWidget'
import css from './OverviewGlanceCards.module.scss'

enum OverviewGalanceCard {
  PROJECT = 'PROJECT',
  SERVICES = 'SERVICES',
  ENV = 'ENV',
  PIPELINES = 'PIPELINES'
}

interface RenderGlanceCardData extends Omit<GlanceCardProps, 'title'> {
  title: keyof StringsMap
}

interface RenderGlanceCardProps {
  loading: boolean
  data: RenderGlanceCardData
}

const projectsTitleId = 'projectsText'
const serviceTitleId = 'services'
const envTitleId = 'environments'
const pipelineTitleId = 'pipelines'

const getDataForCard = (
  cardType: OverviewGalanceCard,
  countDetails: CountChangeDetails | undefined
): RenderGlanceCardData => {
  let glanceCardData: RenderGlanceCardData = { title: 'na', iconName: 'placeholder' }

  if (!countDetails) {
    return glanceCardData
  }

  const countChange = countDetails.countChangeAndCountChangeRateInfo?.countChange
  switch (cardType) {
    case OverviewGalanceCard.PROJECT:
      glanceCardData = {
        title: projectsTitleId,
        iconName: 'nav-project',
        iconSize: 16
      }
      break
    case OverviewGalanceCard.SERVICES:
      glanceCardData = {
        title: serviceTitleId,
        iconName: 'services'
      }
      break
    case OverviewGalanceCard.ENV:
      glanceCardData = {
        title: envTitleId,
        iconName: 'infrastructure'
      }
      break
    case OverviewGalanceCard.PIPELINES:
      glanceCardData = {
        title: pipelineTitleId,
        iconName: 'pipeline',
        iconSize: 38
      }
  }
  glanceCardData.number = countDetails.count
  if (countChange) {
    glanceCardData.delta = countChange > 0 ? `+${countChange.toString()}` : countChange.toString()
  }

  return glanceCardData
}

const RenderGlanceCard: React.FC<RenderGlanceCardProps> = props => {
  const { loading, data } = props
  const { getString } = useStrings()
  return loading ? (
    <Card className={css.loadingWrapper}>
      <Icon name="spinner" size={24} color={Color.PRIMARY_7} />
    </Card>
  ) : (
    <GlanceCard {...data} styling={data.title === projectsTitleId} title={getString(data.title)} />
  )
}

interface OverviewGlanceCardsProp {
  mockData?: UseGetMockData<ResponseExecutionResponseCountOverview>
}

const OverviewGlanceCards: React.FC<OverviewGlanceCardsProp> = props => {
  const { accountId } = useParams<ProjectPathProps>()
  const { selectedTimeRange } = useLandingDashboardContext()
  const [range] = useState([Date.now() - TimeRangeToDays[selectedTimeRange] * 24 * 60 * 60000, Date.now()])
  const {
    data: countResponse,
    loading,
    error,
    refetch
  } = useGetCounts({
    queryParams: {
      accountIdentifier: accountId,
      startTime: range[0],
      endTime: range[1]
    },
    lazy: true,
    mock: props.mockData
  })

  useEffect(() => {
    refetch()
  }, [selectedTimeRange, refetch])

  if (!loading && (error || countResponse?.data?.executionStatus !== 'SUCCESS')) {
    return (
      <Card className={css.errorCard}>
        <DashboardAPIErrorWidget callback={refetch} iconProps={{ size: 75 }}></DashboardAPIErrorWidget>
      </Card>
    )
  }

  const { projectsCountDetail, envCountDetail, servicesCountDetail, pipelinesCountDetail } =
    countResponse?.data?.response || {}

  return (
    <Layout.Horizontal spacing="large">
      <Layout.Vertical spacing="large">
        <RenderGlanceCard loading={!!loading} data={getDataForCard(OverviewGalanceCard.PROJECT, projectsCountDetail)} />
        <RenderGlanceCard loading={!!loading} data={getDataForCard(OverviewGalanceCard.ENV, envCountDetail)} />
      </Layout.Vertical>
      <Layout.Vertical spacing="large">
        <RenderGlanceCard
          loading={!!loading}
          data={getDataForCard(OverviewGalanceCard.SERVICES, servicesCountDetail)}
        />

        <RenderGlanceCard
          loading={!!loading}
          data={getDataForCard(OverviewGalanceCard.PIPELINES, pipelinesCountDetail)}
        />
      </Layout.Vertical>
    </Layout.Horizontal>
  )
}

export default OverviewGlanceCards
