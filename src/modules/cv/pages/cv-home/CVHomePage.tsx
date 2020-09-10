import React from 'react'
import { useHistory } from 'react-router-dom'
import { ModuleName } from 'framework/exports'
import { ModuleLandingView } from 'modules/common/exports'
import { routeCVDataSources } from 'modules/cv/routes'
import type { Project } from 'services/cd-ng'
import i18n from './CVHomePage.i18n'

export default function CVDashboardPage(): JSX.Element {
  const history = useHistory()
  return (
    <ModuleLandingView
      module={ModuleName.CV}
      icon="nav-cv"
      heading={i18n.welcomeToCVText}
      subHeading={i18n.verifyYourDeploymentsSubtitleText}
      description={i18n.addCVToExistingProject}
      onProjectCreated={(project: Project) => {
        history.push({
          pathname: routeCVDataSources.url({
            projectIdentifier: project.identifier || '',
            orgIdentifier: project.orgIdentifier || ''
          }),
          search: '?onBoarding=true'
        })
      }}
    />
  )
}
