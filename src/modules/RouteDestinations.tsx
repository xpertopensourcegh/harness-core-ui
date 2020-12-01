import React from 'react'

import commonRoutes from '@common/RouteDestinations'
import secretsRoutes from '@secrets/RouteDestinations'
import projectsOrgsRoutes from '@projects-orgs/RouteDestinations'
import connectorRoutes from '@connectors/RouteDestinations'
import gitSyncRoutes from '@gitsync/RouteDestinations'
import CDRoutes from '@cd/RouteDestinations'
import CIRoutes from '@ci/RouteDestinations'
import CVRoutes from '@cv/RouteDestinations'
import CFRoutes from '@cf/RouteDestinations'
import CERoutes from '@ce/RouteDestinations'

export default function RouteDestinations(): React.ReactElement {
  return (
    <React.Fragment>
      {commonRoutes}
      {secretsRoutes}
      {projectsOrgsRoutes}
      {connectorRoutes}
      {gitSyncRoutes}
      {CDRoutes}
      {CIRoutes}
      {CVRoutes}
      {CERoutes}
      {CFRoutes}
    </React.Fragment>
  )
}
