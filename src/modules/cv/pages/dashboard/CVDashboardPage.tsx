import React from 'react'
import { useHistory } from 'react-router-dom'
import { ModuleName } from 'framework/exports'
import { routeCVDataSources } from 'modules/cv/routes'
import { linkTo } from 'framework/exports'
import ProjectsPage from '../../../common/pages/ProjectsPage/ProjectsPage'

export default function CVDashboardPage(): JSX.Element {
  const history = useHistory()
  return (
    <ProjectsPage
      module={ModuleName.CV}
      onNewProjectCreated={project => {
        history.push({
          pathname: linkTo(routeCVDataSources),
          state: {
            projectId: project.identifier,
            orgId: project.orgIdentifier
          }
        })
      }}
    />
  )
}
