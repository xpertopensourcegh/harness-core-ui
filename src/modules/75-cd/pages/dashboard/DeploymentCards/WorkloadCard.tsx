import React, { useMemo } from 'react'
import moment from 'moment'
import { Layout, Icon, Color } from '@wings-software/uicore'
import RepositoryCard from '@pipeline/components/Dashboards/BuildCards/RepositoryCard'
import type { WorkloadDateCountInfo } from 'services/cd-ng'

export interface WorkloadCardProps {
  serviceName: string
  lastExecuted: string
  lastMessage?: string
  deploymentType: string
  totalDeployments: number
  percentSuccess: number
  rateSuccess: number
  username?: string
  durationMin?: number
  workload?: WorkloadDateCountInfo[]
}

export default function WorkloadCard({
  serviceName,
  lastExecuted,
  lastMessage,
  totalDeployments,
  percentSuccess,
  rateSuccess,
  username,
  durationMin,
  workload
}: WorkloadCardProps) {
  const countList = useMemo(() => {
    if (workload) {
      return workload.map(val => ({
        time: val.date,
        builds: {
          count: val?.execution?.count
        }
      }))
    }
  }, [workload])

  return (
    <RepositoryCard
      title={
        <Layout.Horizontal spacing="xsmall" style={{ alignItems: 'center', marginLeft: -5 }}>
          <Icon size={30} name={'services' as any} color={Color.PRIMARY_5} />
          {serviceName}
        </Layout.Horizontal>
      }
      message={lastMessage!}
      username={username}
      durationMin={durationMin}
      startTime={moment(lastExecuted, 'YYYY-MM-DD HH:mm:ss').valueOf()}
      count={totalDeployments}
      countLabel="Deployments"
      seriesName="Executions"
      successRate={percentSuccess}
      successRateDiff={rateSuccess}
      countList={countList}
    />
  )
}
