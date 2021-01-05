import React from 'react'
import { useParams, useHistory, useRouteMatch } from 'react-router-dom'
import { Layout } from '@wings-software/uicore'
import { compile } from 'path-to-regexp'

import routes from '@common/RouteDefinitions'
import { ProjectSelector } from '@common/navigation/ProjectSelector/ProjectSelector'
import type { AccountPathProps, ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { SidebarLink } from '@common/navigation/SideNav/SideNav'
import { ModuleName } from 'framework/exports'

export default function CESideNav(): React.ReactElement {
  const { accountId, projectIdentifier, orgIdentifier } = useParams<AccountPathProps & Partial<ProjectPathProps>>()
  const routeMatch = useRouteMatch()
  const history = useHistory()

  return (
    <Layout.Vertical spacing="small">
      <SidebarLink label="Dashboard" to={routes.toCEHome({ accountId })} />
      <ProjectSelector
        moduleFilter={ModuleName.CE}
        onSelect={data => {
          if (projectIdentifier) {
            // changing project
            history.push(
              compile(routeMatch.path)({
                ...routeMatch.params,
                projectIdentifier: data.identifier,
                orgIdentifier: data.orgIdentifier
              })
            )
          } else {
            history.push(
              routes.toCECODashboard({
                projectIdentifier: data.identifier,
                orgIdentifier: data.orgIdentifier || '',
                accountId
              })
            )
          }
        }}
      />
      {projectIdentifier && orgIdentifier ? (
        <React.Fragment>
          <SidebarLink
            label="Cost Optimization"
            to={routes.toCECODashboard({ accountId, projectIdentifier, orgIdentifier })}
          />
        </React.Fragment>
      ) : null}
    </Layout.Vertical>
  )
}
