import React from 'react'
import { useHistory } from 'react-router-dom'
import { ModuleName } from 'framework/exports'
import type { Project } from 'services/cd-ng'
import { ModuleLandingView } from 'modules/common/exports'
import { routeCIOverview } from 'modules/ci/routes'
import i18n from './CFHomePage.i18n'

const CFHomePage: React.FC = () => {
  const history = useHistory()

  return (
    <ModuleLandingView
      module={ModuleName.CF}
      icon="placeholder"
      iconSize={150}
      iconPadding="xxlarge"
      heading={i18n.welcomeToCF}
      subHeading={i18n.description}
      description={i18n.addToExistingProject}
      onProjectCreated={(project: Project) => {
        history.push(routeCIOverview.url({ projectIdentifier: project.identifier as string }))
      }}
    />
  )
}

export default CFHomePage
