import React, { FunctionComponent } from 'react'
import { Tabs, Tab } from '@wings-software/uikit'
import { Container } from '@wings-software/uikit'
import MetricsView from './MetricsView/MetricsView'
import LogAnalysisView from './LogAnalysisView/LogAnalysisView'
import css from './AnomalyDetailsView.module.scss'

interface AnomaliesDetailsProps {
  currentAnomaly: any
}

function renderMetricsTab(currentAnomaly: any): JSX.Element {
  return <MetricsView currentAnomaly={currentAnomaly}> </MetricsView>
}

function renderLogsTab(currentAnomaly: any): JSX.Element {
  return (
    <LogAnalysisView
      endTime={currentAnomaly?.endTime}
      startTime={currentAnomaly?.startTime}
      environment={currentAnomaly?.environment}
      service={currentAnomaly?.service}
    />
  )
}

const AnomalyDetailsView: FunctionComponent<any> = (props: AnomaliesDetailsProps) => {
  return (
    <Container className={css.main}>
      <Container className={css.metricsLogsTabs}>
        <Tabs id="tabsId1">
          <Tab id="tabId1" title="METRICS" panel={renderMetricsTab(props.currentAnomaly)} />
          <Tab id="tabId2" title="LOGS" panel={renderLogsTab(props.currentAnomaly)} />
        </Tabs>
      </Container>
    </Container>
  )
}

export default AnomalyDetailsView
