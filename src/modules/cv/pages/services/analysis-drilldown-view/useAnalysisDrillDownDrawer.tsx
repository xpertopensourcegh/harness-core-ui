import React, { useCallback, useState, useMemo } from 'react'
import { Drawer, IDrawerProps, Position } from '@blueprintjs/core'
import { Container, Text, Color, useModalHook, Tabs, Tab, ExpandingSearchInput } from '@wings-software/uikit'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import highchartsMore from 'highcharts/highcharts-more'
import solidGauge from 'highcharts/modules/solid-gauge'
import getRiskGuageChartOptions from './RiskGaugeChart'
import i18n from './useAnalysisDrillDownDrawer.i18n'
import MetricAnalysisView from './MetricAnalysisView/MetricAnalysisView'
import css from './useAnalysisDrillDownDrawer.module.scss'

interface AnalysisDrillDownInfo {
  riskScore: number
  startTime: number
  endTime: number
  affectedMetrics: string[]
  totalAnomalies: string
  category: string
}

type AnalysisDrillDownReturnType = {
  openDrawer: (updatedData: AnalysisDrillDownInfo) => void
  hideDrawer: () => void
}

highchartsMore(Highcharts)
solidGauge(Highcharts)

const DrawerProps: IDrawerProps = {
  autoFocus: true,
  size: '70%',
  canEscapeKeyClose: true,
  canOutsideClickClose: true,
  enforceFocus: true,
  isOpen: false,
  hasBackdrop: true,
  position: Position.RIGHT,
  usePortal: true,
  style: {
    backgroundColor: 'var(--grey-100)'
  }
}

function LabelValue(props: { label: string; value?: string }): JSX.Element {
  return (
    <Container className={css.keyValue}>
      <Text color={Color.GREY_350} className={css.label}>
        {props.label}
      </Text>
      <Text color={Color.BLACK} className={css.value}>
        {props.value}
      </Text>
    </Container>
  )
}

function AnalysisSummaryHeader(props: AnalysisDrillDownInfo): JSX.Element {
  const { riskScore, startTime, endTime, affectedMetrics, totalAnomalies, category } = props
  const highchartsOptions = useMemo(() => getRiskGuageChartOptions(riskScore), [riskScore])
  return (
    <Container className={css.analysisSummaryHeader}>
      <Container className={css.chartContainer}>
        <HighchartsReact highchart={Highcharts} options={highchartsOptions} />
      </Container>
      <Container className={css.analysisSummary}>
        <Text className={css.categoryName}>{category}</Text>
        <LabelValue
          label={i18n.analysisSummaryText.verificationPeriod}
          value={`${i18n.analysisSummaryText.from} ${new Date(startTime).toLocaleString()}`}
        />
        <LabelValue
          label={i18n.analysisSummaryText.timeDuration}
          value={`${(endTime - startTime) / 60000} ${i18n.timeDurationText.minutes}`}
        />
        <LabelValue label={i18n.analysisSummaryText.affectedMetrics} value={affectedMetrics?.join(',')} />
        <LabelValue label={i18n.analysisSummaryText.totalAnomalies} value={totalAnomalies} />
      </Container>
    </Container>
  )
}

function AnalysisView(): JSX.Element {
  return (
    <Container className={css.analysisView}>
      <Container className={css.analysisViewHeader}>
        <Tabs id="analysisTabs">
          <Tab id={i18n.analysisTabText.metrics} title={i18n.analysisTabText.metrics} panel={<MetricAnalysisView />} />
          <Tab id={i18n.analysisTabText.logs} title={i18n.analysisTabText.logs} panel={<div />} />
        </Tabs>
        <ExpandingSearchInput className={css.analysisFilter} />
      </Container>
    </Container>
  )
}

export default function useAnalysisDrillDownDrawer(initInfo?: AnalysisDrillDownInfo): AnalysisDrillDownReturnType {
  const [drillDownInfo, setDrillDownInfo] = useState(initInfo)

  const [openModal, hideModal] = useModalHook(() => {
    if (drillDownInfo) {
      return (
        <Drawer {...DrawerProps} isOpen={true} className={css.main} onClose={hideModal}>
          <AnalysisSummaryHeader {...drillDownInfo} />
          <AnalysisView />
        </Drawer>
      )
    }
    return <span />
  }, [drillDownInfo])

  const openDrawer = useCallback(
    (updatedData: AnalysisDrillDownInfo) => {
      setDrillDownInfo(updatedData)
      openModal()
    },
    [openModal]
  )

  return {
    openDrawer,
    hideDrawer: hideModal
  }
}
