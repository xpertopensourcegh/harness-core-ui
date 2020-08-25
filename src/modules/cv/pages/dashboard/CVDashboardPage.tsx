import React from 'react'
import { ModuleName } from 'framework/exports'
import ProjectsPage from '../../../common/pages/ProjectsPage/ProjectsPage'

export default function CVDashboardPage(): JSX.Element {
  return <ProjectsPage module={ModuleName.CV} />
}
