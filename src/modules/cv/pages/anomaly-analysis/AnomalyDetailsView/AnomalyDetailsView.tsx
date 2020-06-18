import React, { FunctionComponent } from 'react'
import { Tabs, Tab } from '@wings-software/uikit'
import MetricsView from './MetricsView/MetricsView'
import LogAnalysisView from './LogAnalysisView/LogAnalysisView'

interface AnomaliesDetailsProps {
  currentAnomaly: any
}

function renderMetricsTab(currentAnomaly: any) {
  return <MetricsView currentAnomaly={currentAnomaly}> </MetricsView>
}

function renderLogsTab(currentAnomaly: any) {
  return <LogAnalysisView currentAnomaly={currentAnomaly} />
}

const AnomalyDetailsView: FunctionComponent<any> = (props: AnomaliesDetailsProps) => {
  return (
    <div>
      <Tabs id="tabsId1">
        <Tab id="tabId1" title="METRICS" panel={renderMetricsTab(props.currentAnomaly)} />
        <Tab id="tabId2" title="LOGS" panel={renderLogsTab(props.currentAnomaly)} />
      </Tabs>
    </div>
  )
}

export default AnomalyDetailsView
