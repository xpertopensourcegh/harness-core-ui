import React, { FunctionComponent } from 'react'

interface LogsViewProps {
  currentAnomaly: any
}

const LogsView: FunctionComponent<any> = (props: LogsViewProps) => {
  return <div>{props.currentAnomaly.info.log.name}</div>
}

export default LogsView
