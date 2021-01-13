import React from 'react'
import { Switch, Route } from 'react-router-dom'

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
import delegatesRoutes from '@delegates/RouteDestinations'
import NotFoundPage from '@common/pages/404/NotFoundPage'

export default function RouteDestinations(): React.ReactElement {
  return (
    <Switch>
      {...commonRoutes.props.children}
      {...secretsRoutes.props.children}
      {...delegatesRoutes.props.children}
      {...projectsOrgsRoutes.props.children}
      {...connectorRoutes.props.children}
      {...gitSyncRoutes.props.children}
      {...CIRoutes.props.children}
      {...CDRoutes.props.children}
      {...CVRoutes.props.children}
      {...CFRoutes.props.children}
      {...CERoutes.props.children}

      <Route path="*">
        <NotFoundPage />
      </Route>
    </Switch>
  )
}
