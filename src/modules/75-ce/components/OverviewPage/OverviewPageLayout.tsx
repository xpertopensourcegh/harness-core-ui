import React, { ReactNode, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import cx from 'classnames'
import { Color, Container, Icon, IconName, Layout, Text } from '@wings-software/uicore'
import routes from '@common/RouteDefinitions'
import { CE_COLOR_CONST, getRadialChartOptions } from '@ce/components/CEChart/CEChartOptions'
import CEChart from '@ce/components/CEChart/CEChart'
import formatCost from '@ce/utils/formatCost'
import { CCM_CHART_TYPES } from '@ce/constants'
import { useStrings } from 'framework/strings'

import css from './OverviewPage.module.scss'

export const LEGEND_LIMIT = 5

export enum ListType {
  KEY_ONLY,
  KEY_VALUE
}

export interface Stats {
  label: string
  value: number
  trend: number
  legendColor: string
  linkId?: string | null
}

interface LayoutProps {
  title: string
  chartData: Stats[]
  totalCost: Stats
  showTrendInChart?: boolean
  seeAll?: ReactNode
}

interface VerticalLayoutProps extends LayoutProps {
  footer?: React.ReactNode
}

interface HorizontalLayoutProps extends LayoutProps {
  sideBar?: React.ReactNode
}

interface CardProps {
  classNames?: string
}

interface CostDistributionRadialChartProps {
  data: Stats[]
  colors?: string[]
  classNames?: string
  chartSize?: { height: number; width: number }
  gist: React.ReactNode
}

interface GistProps {
  showTrend?: boolean
  label?: string
  totalCostFontSize: string
  totalCost: Stats
}

interface TrendProps {
  value: number
  downIcon?: string
  upIcon?: string
  iconSize?: number
}

interface LegendProps {
  color: string
  label: React.ReactNode
}

interface EfficiencyScoreProps {
  title?: string
  score: number
  trend: number
}

interface ListProps {
  data: Stats[]
  type?: ListType
  classNames?: string
}

interface ChartTypeProps {
  chartType: CCM_CHART_TYPES
  setChartType: React.Dispatch<React.SetStateAction<CCM_CHART_TYPES>>
}

const getNumberOfDigits = (num = 0) => {
  if (num % 1 != 0) {
    const parts = num.toString().split('.')
    return parts[0].length + parts[1].length
  }

  return num.toString().length
}

export const VerticalLayout = (props: VerticalLayoutProps) => {
  const { title, chartData, totalCost, footer, showTrendInChart, seeAll } = props
  const len = getNumberOfDigits(+(totalCost.value || 0).toFixed(2))
  const totalCostFontSize = len > 7 ? '20px' : '24px'

  return (
    <div className={css.verticalLayout}>
      <Layout.Horizontal style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Text color="grey800" font={{ weight: 'semi-bold', size: 'medium' }}>
          {title}
        </Text>
        {seeAll}
      </Layout.Horizontal>
      <div className={css.centerChart}>
        <CostDistributionRadialChart
          data={chartData}
          gist={<Gist totalCostFontSize={totalCostFontSize} totalCost={totalCost} showTrend={showTrendInChart} />}
        />
      </div>
      {footer}
    </div>
  )
}

export const HorizontalLayout = (props: HorizontalLayoutProps) => {
  const { title, chartData, totalCost, sideBar, showTrendInChart, seeAll } = props
  const len = getNumberOfDigits(+(totalCost.value || 0).toFixed(2))
  const totalCostFontSize = len > 7 ? '15px' : '18px'

  return (
    <div className={css.horizontalLayout}>
      <Layout.Horizontal style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Text color="grey800" font={{ weight: 'semi-bold', size: 'medium' }}>
          {title}
        </Text>
        {seeAll}
      </Layout.Horizontal>
      <div className={css.cols}>
        <CostDistributionRadialChart
          data={chartData}
          chartSize={{ height: 200, width: 250 }}
          gist={<Gist totalCostFontSize={totalCostFontSize} totalCost={totalCost} showTrend={showTrendInChart} />}
        />
        {sideBar}
      </div>
    </div>
  )
}

const CostDistributionRadialChart = (props: CostDistributionRadialChartProps) => {
  const { data, colors = CE_COLOR_CONST, chartSize, gist } = props
  const options = useMemo(() => getRadialChartOptions(data as any, colors, { chart: chartSize }), [data, colors])

  return (
    <div className={css.chartContainer}>
      <CEChart options={options} />
      <div className={css.gist}>{gist}</div>
    </div>
  )
}

const Gist = (props: GistProps) => {
  const { getString } = useStrings()
  const { label = getString('ce.overview.totalCost'), showTrend = true, totalCostFontSize, totalCost } = props
  return (
    <Layout.Vertical spacing="small" style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <Text color="grey600" font="small">
        {label}
      </Text>
      <Text color="grey800" font={{ weight: 'bold' }} style={{ fontSize: totalCostFontSize }}>
        {formatCost(totalCost.value)}
      </Text>
      {showTrend && <Trend value={totalCost.trend} />}
    </Layout.Vertical>
  )
}

export const Trend = (props: TrendProps) => {
  const { iconSize = 16, value = 0, downIcon = 'caret-down', upIcon = 'caret-up' } = props

  const v = +value
  let icon: Record<string, string | undefined> = { name: undefined, color: undefined } // when v = 0

  if (v < 0) {
    icon = { name: downIcon, color: Color.GREEN_500 }
  } else if (v > 0) {
    icon = { name: upIcon, color: Color.RED_500 }
  }

  return (
    <Text
      font="small"
      color="grey700"
      inline
      icon={icon.name as IconName}
      iconProps={{ size: iconSize, color: icon.color }}
    >
      {`${Math.abs(v)}%`}
    </Text>
  )
}

export const EfficiencyScore = (props: EfficiencyScoreProps) => {
  const { getString } = useStrings()
  const { title = getString('ce.overview.cardtitles.efficiencyScore'), score, trend } = props
  return (
    <div className={css.efficienyScore}>
      <Layout.Vertical>
        <Text>{title}</Text>
        <Layout.Horizontal spacing="small" style={{ alignItems: 'center' }}>
          <Text color="grey800" font={{ weight: 'bold' }} style={{ fontSize: 24 }}>
            {score}
          </Text>
          <Trend value={trend} />
        </Layout.Horizontal>
      </Layout.Vertical>
    </div>
  )
}

const Legend = (props: LegendProps) => {
  const { color, label } = props
  return (
    <Layout.Horizontal spacing="small" style={{ alignItems: 'center' }}>
      <div className={css.legendColor} style={{ background: color }}></div>
      {label}
    </Layout.Horizontal>
  )
}

export const List = (props: ListProps) => {
  const { accountId } = useParams<{ accountId: string }>()
  const { data = [], type = ListType.KEY_ONLY, classNames } = props

  const renderItem = (item: Stats, idx: number) => {
    if (type === ListType.KEY_VALUE) {
      return (
        <Layout.Horizontal key={idx} spacing="large" style={{ alignItems: 'center' }}>
          <Legend
            color={item.legendColor as string}
            label={
              item.linkId ? (
                <Link
                  to={routes.toPerspectiveDetails({
                    accountId: accountId,
                    perspectiveId: item.linkId,
                    perspectiveName: item.linkId
                  })}
                >
                  <Text inline color="primary7" font="small" lineClamp={1} style={{ width: 100 }}>
                    {item.label}
                  </Text>
                </Link>
              ) : (
                <Text color="grey800" font="small" lineClamp={1} style={{ width: 100 }}>
                  {item.label}
                </Text>
              )
            }
          />
          <Text color="grey600" font="small">
            {formatCost(item.value)}
          </Text>
        </Layout.Horizontal>
      )
    }

    return (
      <Container padding={{ top: 'small' }}>
        <Legend
          key={idx}
          color={item.legendColor as string}
          label={
            <Text color="grey800" font="small" lineClamp={1} style={{ width: 100 }}>
              {item.label}
            </Text>
          }
        />
      </Container>
    )
  }

  return <div className={cx(css.list, classNames)}>{data.map(renderItem)}</div>
}

export const Loader = (props: { className?: string }) => {
  return (
    <Container className={cx(css.chartLoadingContainer, props.className)}>
      <Icon name="spinner" color="blue500" size={30} />
    </Container>
  )
}

export const Card: React.FC<CardProps> = props => {
  return <div className={cx(css.card, props.classNames)}>{props.children}</div>
}

export const ChartTypes: React.FC<ChartTypeProps> = ({ chartType, setChartType }) => {
  return (
    <Layout.Horizontal
      spacing="small"
      style={{
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}
    >
      <Icon
        style={{ cursor: 'pointer ' }}
        name="timeline-area-chart"
        onClick={() => {
          setChartType(CCM_CHART_TYPES.AREA)
        }}
        size={20}
        color={chartType === CCM_CHART_TYPES.AREA ? 'primary7' : 'grey400'}
      />
      <Icon
        style={{ cursor: 'pointer ' }}
        name="timeline-bar-chart"
        onClick={() => {
          setChartType(CCM_CHART_TYPES.COLUMN)
        }}
        size={18}
        color={chartType === CCM_CHART_TYPES.COLUMN ? 'primary7' : 'grey400'}
      />
    </Layout.Horizontal>
  )
}
