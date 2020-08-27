import React from 'react'
import { ModuleName } from 'framework/exports'
import { ModuleLandingView } from 'modules/common/exports'
import i18n from './CVHomePage.i18n'

export default function CVDashboardPage(): JSX.Element {
  return (
    <ModuleLandingView
      module={ModuleName.CV}
      icon="nav-cv"
      heading={i18n.welcomeToCVText}
      subHeading={i18n.verifyYourDeploymentsSubtitleText}
      description={i18n.addCVToExistingProject}
      onProjectCreated={() => undefined}
    />
  )
}
