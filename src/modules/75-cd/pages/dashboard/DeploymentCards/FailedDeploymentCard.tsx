import React from 'react'
import { Icon } from '@wings-software/uicore'
import FailedBuildCard from '@pipeline/components/Dashboards/BuildCards/FailedBuildCard'
import styles from '../CDDashboardPage.module.scss'

export interface FailedDeploymentCardProps {
  name: string
  startTime: number
  endTime: number
  serviceInfoList: any
}

export default function FailedDeploymentCard({ name, startTime, endTime, serviceInfoList }: FailedDeploymentCardProps) {
  return (
    <FailedBuildCard
      title={name}
      message={serviceInfoList?.map((s: any, i: any) => (
        <span key={i} className={styles.serviceTag}>
          <Icon size={10} name={'services' as any} />
          {`${s.serviceName}${s.servicetag ? ' (' + s.serviceTag + ')' : ''}`}
        </span>
      ))}
      startTime={startTime}
      endTime={endTime}
      silentStatus
    />
  )
}
