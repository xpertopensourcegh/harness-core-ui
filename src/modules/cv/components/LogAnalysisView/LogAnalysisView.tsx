import React, { useState, useCallback } from 'react'
import type { DSConfig } from '@wings-software/swagger-ts/definitions'
import { Container, Text, Tabs, Tab } from '@wings-software/uikit'
import i18n from './LogAnalysisView.i18n'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import getAnomalyScatterPlotOptions from './AnomalyScatterPlot'

interface LogAnalysisViewProps {
  startTime: number
  endTime: number
  dataSourceType: DSConfig['type']
}

export function LogAnalysisView(props: LogAnalysisViewProps): JSX.Element {
  const [isAnomalousTabSelected, setAnomalousTabSelected] = useState(false)
  const onTabChangeCallback = useCallback(
    (selectedTab: string) => setAnomalousTabSelected(selectedTab === i18n.analysisTabs.anomalous),
    []
  )

  return (
    <Container>
      <Container>
        <Text>{`${i18n.clusterHeading.firstHalf}40${i18n.clusterHeading.secondHalf}`}</Text>
        <HighchartsReact highcharts={Highcharts} options={getAnomalyScatterPlotOptions()} />
        <Tabs id="LogAnalysisTabs" onChange={onTabChangeCallback}>
          <Tab id={i18n.analysisTabs.anomalous}>{i18n.analysisTabs.anomalous}</Tab>
          <Tab id={i18n.analysisTabs.all}>{i18n.analysisTabs.all}</Tab>
        </Tabs>
      </Container>
    </Container>
  )
}
