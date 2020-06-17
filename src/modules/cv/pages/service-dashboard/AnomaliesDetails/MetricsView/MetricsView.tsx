import React, { FunctionComponent } from 'react'

interface MetricsViewProps {
  currentAnomaly: any
}

const MetricsView: FunctionComponent<any> = (props: MetricsViewProps) => {
  return <div>{props.currentAnomaly.info.metric.name}</div>
}

export default MetricsView
