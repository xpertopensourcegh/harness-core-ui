import React, { useMemo } from 'react'
import { Layout, Icon, Color } from '@wings-software/uicore'
import { useHistory, useParams } from 'react-router-dom'
import RepositoryCard from '@pipeline/components/Dashboards/BuildCards/RepositoryCard'
import type { WorkloadDateCountInfo, LastWorkloadInfo } from 'services/cd-ng'
import routes from '@common/RouteDefinitions'
import type { ModulePathParams, ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import css from '../CDDashboardPage.module.scss'
export interface WorkloadCardProps {
  serviceName: string
  lastExecuted?: LastWorkloadInfo
  lastMessage?: string
  totalDeployments: number
  percentSuccess: number
  rateSuccess: number
  username?: string
  workload?: WorkloadDateCountInfo[]
  serviceId?: string
}

export default function WorkloadCard({
  serviceName,
  lastExecuted,
  lastMessage,
  totalDeployments,
  percentSuccess,
  rateSuccess,
  username,
  workload,
  serviceId = ''
}: WorkloadCardProps) {
  const history = useHistory()

  const { accountId, orgIdentifier, projectIdentifier, module } = useParams<ProjectPathProps & ModulePathParams>()
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

  const gotoServices = (): void => {
    history.push(routes.toServiceDetails({ accountId, orgIdentifier, projectIdentifier, serviceId, module }))
  }
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
      startTime={lastExecuted?.startTime as number}
      endTime={lastExecuted?.endTime as number}
      count={totalDeployments}
      countLabel="Deployments"
      seriesName="Executions"
      successRate={percentSuccess}
      successRateDiff={rateSuccess}
      countList={countList}
      onClick={gotoServices}
      className={css.hoverService}
    />
  )
}
