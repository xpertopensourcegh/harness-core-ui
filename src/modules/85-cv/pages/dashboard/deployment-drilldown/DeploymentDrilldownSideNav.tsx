import React from 'react'
import { Container } from '@wings-software/uikit'
import i18n from './DeploymentDrilldownView.i18n'
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
  const labels = [i18n.preProductionTests, i18n.productionDeployment, i18n.postDeployment]
  const phases = [InstancePhase.PRE_PRODUCTION, InstancePhase.PRODUCTION, InstancePhase.POST_DEPLOYMENT]
  return (
    <Container className={styles.sideNav}>
      {[props.preProductionInstances, props.productionDeployment, props.postDeploymentInstances].map((instances, i) => (
        <DeploymentGroupList
          key={i}
          name={labels[i]}
          defaultOpen
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
