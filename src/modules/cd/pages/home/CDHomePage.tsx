import React from 'react'
import { useHistory } from 'react-router-dom'
import { ModuleName } from 'framework/exports'
import type { Project } from 'services/cd-ng'
import { ModuleLandingView } from 'modules/common/exports'
import { routeCDDashboard } from 'modules/cd/routes'
import i18n from './CDHomePage.i18n'

const CDHomePage: React.FC = () => {
  const history = useHistory()

  return (
    <ModuleLandingView
      module={ModuleName.CD}
      icon="nav-cd"
      heading={i18n.welcomeToCD}
      subHeading={i18n.deployYourService}
      description={i18n.addCdToExistingProject}
      onProjectCreated={(project: Project) => {
        history.push(routeCDDashboard.url({ projectIdentifier: project.identifier as string }))
      }}
      onCardClick={(project: Project) => {
        history.push(
          routeCDDashboard.url({
            projectIdentifier: project?.identifier as string
          })
        )
      }}
      onRowClick={(project: Project) => {
        history.push(
          routeCDDashboard.url({
            projectIdentifier: project?.identifier as string
          })
        )
      }}
    />
  )
}

export default CDHomePage
