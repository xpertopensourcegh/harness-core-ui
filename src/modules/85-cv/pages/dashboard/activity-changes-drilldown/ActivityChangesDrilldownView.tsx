import React, { useState } from 'react'
import { Page } from '@common/exports'
import { useRouteParams } from 'framework/exports'
import DeploymentDrilldownViewHeader from '../deployment-drilldown/DeploymentDrilldownViewHeader'
import VerificationInstacePostDeploymentView from '../deployment-drilldown/VerificationInstancePostDeploymentView'
import styles from './ActivityChangesDrilldownView.module.scss'

export default function ActivityChangesDrilldownView() {
  const {
    params: { activityId }
  } = useRouteParams()
  const [activity, setActivity] = useState<any>()
  return (
    <>
      <Page.Header
        title={
          <DeploymentDrilldownViewHeader
            deploymentTag={activity?.activityName}
            environments={[activity?.environmentIdentifier]}
            service={activity?.serviceIdentifier}
          />
        }
      />
      <Page.Body className={styles.main}>
        <VerificationInstacePostDeploymentView
          selectedActivityId={activityId as string}
          environmentIdentifier={activity?.environmentIdentifier ?? ''}
          activityStartTime={activity?.activityStartTime ?? 0}
          durationMs={activity ? activity.endTime - activity.activityStartTime : 0}
          onActivityLoaded={setActivity}
        />
      </Page.Body>
    </>
  )
}
