import React from 'react'
import { useLocation } from 'react-router-dom'

import ExecutionGraphView from './ExecutionGraphView/ExecutionGraphView'
import ExecutionLogView from './ExecutionLogView/ExecutionLogView'

export default function ExecutionPipelineView(): React.ReactElement {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const view = queryParams.get('view')
  const isLogView = view === 'log'

  if (isLogView) {
    return <ExecutionLogView />
  }

  return <ExecutionGraphView />
}
