import React from 'react'
import { useHistory } from 'react-router-dom'
import { ModuleLandingView } from '@projects-orgs/components/ModuleLandingView/ModuleLandingView'
import { ModuleName } from 'framework/exports'
import type { Project } from 'services/cd-ng'
import { routeCIDashboard } from 'navigation/ci/routes'
import i18n from './CIHomePage.i18n'

const CIHomePage: React.FC = () => {
  const history = useHistory()

  return (
    <ModuleLandingView
      module={ModuleName.CI}
      icon="placeholder"
      iconSize={150}
      iconPadding="xxlarge"
      heading={i18n.welcomeToCI}
      subHeading={i18n.buildFastPipelines}
      description={i18n.addCIToExistingProject}
      onProjectCreated={(project: Project) => {
        history.push(
          routeCIDashboard.url({
            orgIdentifier: project.orgIdentifier as string,
            projectIdentifier: project.identifier as string
          })
        )
      }}
    />
  )
}

export default CIHomePage
