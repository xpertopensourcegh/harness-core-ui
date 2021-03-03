import React from 'react'
import { useParams, useHistory, useRouteMatch } from 'react-router-dom'
import { Layout } from '@wings-software/uicore'
import { compile } from 'path-to-regexp'

import routes from '@common/RouteDefinitions'
import { ProjectSelector } from '@common/navigation/ProjectSelector/ProjectSelector'
import type { PipelinePathProps } from '@common/interfaces/RouteInterfaces'
import { SidebarLink } from '@common/navigation/SideNav/SideNav'
import { useAppStore, useStrings } from 'framework/exports'
import { useFeatureFlags } from '@common/hooks/useFeatureFlag'

export default function CDSideNav(): React.ReactElement {
  const params = useParams<PipelinePathProps>()
  const routeMatch = useRouteMatch()
  const history = useHistory()
  const { NG_RBAC_ENABLED } = useFeatureFlags()
  const { updateAppStore } = useAppStore()
  const { getString } = useStrings()

  return (
    <Layout.Vertical spacing="small">
      <ProjectSelector
        onSelect={data => {
          updateAppStore({ selectedProject: data })
          // changing project
          history.push(
            compile(routeMatch.path)({
              ...routeMatch.params,
              projectIdentifier: data.identifier,
              orgIdentifier: data.orgIdentifier
            })
          )
        }}
      />
      <SidebarLink label={getString('overview')} to={routes.toProjectDetails(params)} />
      <SidebarLink label={getString('resources')} to={routes.toProjectResources(params)} />
      {NG_RBAC_ENABLED && <SidebarLink label={getString('accessControl')} to={routes.toAccessControl(params)} />}
    </Layout.Vertical>
  )
}
