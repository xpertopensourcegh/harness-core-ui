import { LogViewer } from '@wings-software/uicore'
import React from 'react'
import { useParams } from 'react-router-dom'
import { Service, ServiceLog, useLogsOfService } from 'services/lw'

interface COGatewayLogsProps {
  service: Service | undefined
}

interface LogObject {
  logLevel?: string
  createdAt?: number
  logLine: string
}

const logColorMap = {
  errored: '\u001b[30m',
  active: '\u001b[32m'
}

function getLogs(logs: ServiceLog[] | undefined): LogObject[] {
  if (!logs) {
    return []
  }
  const logObjects: LogObject[] = []
  logs.map(l => {
    let logLine = ''
    if (l.error) {
      logLine = `${logColorMap.errored}${l.created_at}  Rule state changed to: ${l.state} ${l.error ? l.error : ''} ${
        l.message ? l.message : ''
      }`
    } else if (l.state == 'active') {
      logLine = `${logColorMap.active}${l.created_at}  Rule state changed to: ${l.state} ${l.message ? l.message : ''}`
    } else {
      logLine = `${l.created_at}  Rule state changed to: ${l.state} ${l.error ? l.error : ''} ${
        l.message ? l.message : ''
      }`
    }
    logObjects.push({
      logLine: logLine
    })
  })
  return logObjects
}
const COGatewayLogs: React.FC<COGatewayLogsProps> = props => {
  const { orgIdentifier, projectIdentifier } = useParams<{
    accountId: string
    orgIdentifier: string
    projectIdentifier: string
  }>()
  const { data, loading } = useLogsOfService({
    org_id: orgIdentifier, // eslint-disable-line
    projectID: projectIdentifier, // eslint-disable-line
    serviceID: props.service?.id as number
  })
  return <LogViewer logs={getLogs(data?.response)} isLoading={loading} defaultOptions={{ LogLimit: 50 }} />
}

export default COGatewayLogs
