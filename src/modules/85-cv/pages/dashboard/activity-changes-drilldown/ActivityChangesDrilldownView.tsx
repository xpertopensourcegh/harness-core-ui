import React from 'react'
import { Container } from '@wings-software/uikit'
import classnames from 'classnames'
import { Page } from '@common/exports'
import CVProgressBar from '@cv/components/CVProgressBar/CVProgressBar'
import {
  MockedActivitiesTimelineView,
  ActivitiesFlagBorder
} from '@cv/components/ActivitiesTimelineView/ActivitiesTimelineView'
import DeploymentDrilldownViewHeader from '../deployment-drilldown/DeploymentDrilldownViewHeader'
import { AnalysisDrillDownView } from '../../services/analysis-drilldown-view/AnalysisDrillDownView'
import { VerificationStatusBarMocked } from './VerificationStatusBar'
import styles from './ActivityChangesDrilldownView.module.scss'

export default function ActivityChangesDrilldownView() {
  return (
    <>
      <Page.Header
        title={
          <DeploymentDrilldownViewHeader
            deploymentTag="Infrastructure_update"
            environments={['Freemium']}
            service="test_one"
          />
        }
      />
      <Page.Body className={styles.main}>
        <Container className={styles.panel}>
          <CVProgressBar value={0.7} />
          <VerificationStatusBarMocked />
        </Container>
        <Container className={styles.panel}>
          <MockedActivitiesTimelineView />
        </Container>
        <Container className={classnames(styles.panel, styles.analysisPanel)}>
          <AnalysisDrillDownView
            startTime={1603357200000}
            endTime={1603358100000}
            environmentIdentifier="prod"
            serviceIdentifier="verification_service"
          />
        </Container>
        <ActivitiesFlagBorder />
      </Page.Body>
    </>
  )
}
