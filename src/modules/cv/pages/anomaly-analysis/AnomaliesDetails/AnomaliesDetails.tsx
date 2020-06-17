import React, { FunctionComponent } from 'react'
import { Tabs, Tab } from '@wings-software/uikit'
import MetricsView from './MetricsView/MetricsView'
import LogsView from './LogsView/LogsView'

interface AnomaliesDetailsProps {
  currentAnomaly: any
}

function renderMetricsTab(currentAnomaly: any) {
  return <MetricsView currentAnomaly={currentAnomaly}> </MetricsView>
}

function renderLogsTab(currentAnomaly: any) {
  return <LogsView currentAnomaly={currentAnomaly}> </LogsView>
}

const AnomaliesDetails: FunctionComponent<any> = (props: AnomaliesDetailsProps) => {
  return (
    <div>
      <Tabs id="tabsId1">
        <Tab id="tabId1" title="METRICS" panel={renderMetricsTab(props.currentAnomaly)} />
        <Tab id="tabId2" title="LOGS" panel={renderLogsTab(props.currentAnomaly)} />
      </Tabs>
    </div>
  )
}

export default AnomaliesDetails
