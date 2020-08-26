import React from 'react'
import { useHistory } from 'react-router-dom'
import { ModuleName } from 'framework/exports'
import type { ProjectDTO } from 'services/cd-ng'
import { ModuleLandingView } from 'modules/common/exports'
import { routeCIOverview } from 'modules/ci/routes'
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
      onProjectCreated={(project: ProjectDTO) => {
        history.push(routeCIOverview.url({ projectIdentifier: project.identifier as string }))
      }}
    />
  )
}

export default CIHomePage
