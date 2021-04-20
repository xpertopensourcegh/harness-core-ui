import React from 'react'
import { Container } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import DeploymentGroupList from './DeploymentGroupList'
import styles from './DeploymentDrilldownView.module.scss'

export interface DeploymentDrilldownSideNavProps {
  preProductionInstances?: Array<any>
  postDeploymentInstances?: Array<any>
  productionDeployment?: Array<any>
  selectedInstance?: any
  onSelect: (instance: any, phase: InstancePhase) => void
}

export enum InstancePhase {
  PRE_PRODUCTION = 'PRE_PRODUCTION',
  PRODUCTION = 'PRODUCTION',
  POST_DEPLOYMENT = 'POST_DEPLOYMENT'
}

export default function DeploymentDrilldownSideNav(props: DeploymentDrilldownSideNavProps) {
  const { getString } = useStrings()
  const labels = [
    getString('cv.preProductionTests'),
    getString('cv.activityChanges.productionDeployment'),
    getString('cv.postDeployment')
  ]
  const phases = [InstancePhase.PRE_PRODUCTION, InstancePhase.PRODUCTION, InstancePhase.POST_DEPLOYMENT]
  return (
    <Container className={styles.sideNav}>
      {[props.preProductionInstances, props.productionDeployment, props.postDeploymentInstances].map((instances, i) => (
        <DeploymentGroupList
          key={i}
          name={labels[i]}
          items={instances?.map(item => ({
            name: item.jobName,
            environment: item.environmentName,
            startedOn: item.startTime,
            status: item.status,
            onClick: () => props.onSelect(item, phases[i]),
            selected: props.selectedInstance === item
          }))}
        />
      ))}
    </Container>
  )
}
