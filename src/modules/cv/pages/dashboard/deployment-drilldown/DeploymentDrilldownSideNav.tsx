import React from 'react'
import { Container } from '@wings-software/uikit'
import i18n from './DeploymentDrilldownView.i18n'
import DeploymentGroupList from './DeploymentGroupList'
import styles from './DeploymentDrilldownView.module.scss'

export interface DeploymentDrilldownSideNavProps {
  preProductionInstances?: Array<any>
  postDeploymentInstances?: Array<any>
  productionDeployment?: Array<any>
  selectedInstance: any
  onSelect: (instance: string) => void
}

export default function DeploymentDrilldownSideNav(props: DeploymentDrilldownSideNavProps) {
  const labels = [i18n.preProductionTests, i18n.postDeployment, i18n.productionDeployment]
  return (
    <Container className={styles.sideNav}>
      {[props.preProductionInstances, props.postDeploymentInstances, props.productionDeployment].map((instances, i) => (
        <DeploymentGroupList
          key={i}
          name={labels[i]}
          defaultOpen
          items={instances?.map(item => ({
            name: item.jobName,
            environment: item.environmentName,
            startedOn: item.startTime,
            status: item.status,
            onClick: () => props.onSelect(item),
            selected: props.selectedInstance === item
          }))}
        />
      ))}
    </Container>
  )
}
