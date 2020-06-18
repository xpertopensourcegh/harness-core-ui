import React, { useState, useCallback, useMemo } from 'react'
import { Container, Text, Tabs, Tab, Color } from '@wings-software/uikit'
import i18n from './LogAnalysisView.i18n'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import getAnomalyScatterPlotOptions from './AnomalyScatterPlot'
import css from './LogAnalysisView.module.scss'
import { LogAnalysisRow } from './LogAnalysisRow/LogAnalysisRow'

interface LogAnalysisViewProps {
  currentAnomaly: any
}

export default function LogAnalysisView(_: LogAnalysisViewProps): JSX.Element {
  const [isAnomalousTabSelected, setAnomalousTabSelected] = useState(false)
  const onTabChangeCallback = useCallback(
    (selectedTab: string) => setAnomalousTabSelected(selectedTab === i18n.analysisTabs.anomalous),
    []
  )
  const highchartsOptions = useMemo(() => getAnomalyScatterPlotOptions(), [])

  return (
    <Container className={css.main}>
      <Container className={css.heading}>
        <Text
          color={Color.BLACK}
          className={css.clusterHeading}
        >{`${i18n.clusterHeading.firstHalf}40${i18n.clusterHeading.secondHalf}`}</Text>
        <Container className={css.tabContainer}>
          <Tabs id="LogAnalysisTabs" onChange={onTabChangeCallback}>
            <Tab id={i18n.analysisTabs.anomalous}>{i18n.analysisTabs.anomalous}</Tab>
            <Tab id={i18n.analysisTabs.all}>{i18n.analysisTabs.all}</Tab>
          </Tabs>
        </Container>
      </Container>
      <Container className={css.chartContainer}>
        <HighchartsReact highcharts={Highcharts} options={highchartsOptions} />
      </Container>
      {isAnomalousTabSelected ? (
        <Container className={css.logContainer}>
          <LogAnalysisRow isColumnHeader={true} />
          <LogAnalysisRow />
        </Container>
      ) : undefined}
    </Container>
  )
}
