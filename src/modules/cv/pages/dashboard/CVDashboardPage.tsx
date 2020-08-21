import React from 'react'
import { useHistory } from 'react-router'
import { ModuleName } from 'framework/exports'
import { routeCVDataSources } from 'modules/cv/routes'
import ProjectsPage from '../../../common/pages/ProjectsPage/ProjectsPage'

export default function CVDashboardPage(): JSX.Element {
  const history = useHistory()
  return (
    <ProjectsPage
      module={ModuleName.CV}
      onNewProjectCreated={project => {
        history.push({
          pathname: routeCVDataSources.url({
            projectIdentifier: project.identifier as string,
            orgId: project.orgIdentifier as string
          }),
          state: {
            projectIdentifier: project.identifier,
            orgId: project.orgIdentifier
          }
        })
      }}
    />
  )
}
