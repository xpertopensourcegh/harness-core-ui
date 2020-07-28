import React, { useMemo } from 'react'
import { Page } from 'modules/common/exports'
import { ActivityDetailsActivityType, ActivityDetailsActivitySource } from 'modules/cv/routePaths'
import { routeParams } from 'framework/exports'
import i18n from './ActivitySetupPage.i18n'
import { Container } from '@wings-software/uikit'
import css from './ActivitySetupPage.module.scss'
import BlueGreenVerificationJobForm from './VerificationJobForms/BlueGreenVerificationJobForm/BlueGreenVerificationJobForm'
import CanaryVerificationJobForm from './VerificationJobForms/CanaryVerificationJobForm/CanaryVerificationJobForm'
import TestVerificationJobForm from './VerificationJobForms/TestVerificationJobForm/TestVerificationJobForm'
import HealthVerificationJobForm from './VerificationJobForms/HealthVerificationJobForm/HealthVerificationJobForm'
import KubernetesActivitySourceForm from './ActivitySourceForms/KubernetesActivitySourceForm/KubernetesActivitySourceForm'

export default function ActivitySetupPage(): JSX.Element {
  const {
    params: { activityType }
  } = routeParams()
  const { desiredForm, title } = useMemo(() => {
    switch (activityType) {
      case ActivityDetailsActivityType.BG:
        return { desiredForm: <BlueGreenVerificationJobForm />, title: i18n.bgTitle }
      case ActivityDetailsActivityType.CANARY:
        return { desiredForm: <CanaryVerificationJobForm />, title: i18n.canaryTitle }
      case ActivityDetailsActivityType.TEST:
        return { desiredForm: <TestVerificationJobForm />, title: i18n.testTitle }
      case ActivityDetailsActivityType.HEALTH:
        return { desiredForm: <HealthVerificationJobForm />, title: i18n.healthTitle }
      case ActivityDetailsActivitySource.KUBERNETES:
        return { desiredForm: <KubernetesActivitySourceForm />, title: i18n.kubernetesTitle }
      default:
        return { desiredForm: <span />, title: '' }
    }
  }, [activityType])
  return (
    <Page.Body>
      <Container className={css.main}>
        <Page.Header title={title} />
        <Container className={css.selectedFormContainer}>{desiredForm}</Container>
      </Container>
    </Page.Body>
  )
}
