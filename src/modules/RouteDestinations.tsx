import React from 'react'
import { Switch, Route } from 'react-router-dom'

import commonRoutes from '@common/RouteDestinations'
import { useFeatureFlags } from '@common/hooks/useFeatureFlag'
import secretsRoutes from '@secrets/RouteDestinations'
import rbacRoutes from '@rbac/RouteDestinations'
import projectsOrgsRoutes from '@projects-orgs/RouteDestinations'
import connectorRoutes from '@connectors/RouteDestinations'
import userProfileRoutes from '@user-profile/RouteDestinations'
import '@pipeline/RouteDestinations'
import CDRoutes from '@cd/RouteDestinations'
import CIRoutes from '@ci/RouteDestinations'
import CVRoutes from '@cv/RouteDestinations'
import CFRoutes from '@cf/RouteDestinations'
import CERoutes from '@ce/RouteDestinations'
import delegatesRoutes from '@delegates/RouteDestinations'
import DASHBOARDRoutes from '@dashboards/RouteDestinations'
import NotFoundPage from '@common/pages/404/NotFoundPage'
import type { HarnessModules } from 'framework/strings/StringsContext'

export default function RouteDestinations(): React.ReactElement {
  const { CDNG_ENABLED, CVNG_ENABLED, CING_ENABLED, CENG_ENABLED, CFNG_ENABLED, NG_USERPROFILE } = useFeatureFlags()

  React.useEffect(() => {
    const data: HarnessModules[] = []

    if (CDNG_ENABLED) data.push('cd')
    if (CVNG_ENABLED) data.push('cv')
    if (CING_ENABLED) data.push('ci')
    if (CENG_ENABLED) data.push('ce')
    if (CFNG_ENABLED) data.push('cf')

    window.dispatchEvent(
      new CustomEvent<HarnessModules[]>('LOAD_STRINGS_CHUNK', {
        detail: data
      })
    )
  }, [CDNG_ENABLED, CVNG_ENABLED, CING_ENABLED, CENG_ENABLED, CFNG_ENABLED])
  return (
    <Switch>
      {...commonRoutes.props.children}
      {...secretsRoutes.props.children}
      {...rbacRoutes.props.children}
      {...delegatesRoutes.props.children}
      {...projectsOrgsRoutes.props.children}
      {...connectorRoutes.props.children}
      {...NG_USERPROFILE ? userProfileRoutes.props.children : []}
      {...CING_ENABLED ? CIRoutes.props.children : []}
      {...CDNG_ENABLED ? CDRoutes.props.children : []}
      {...CVNG_ENABLED ? CVRoutes.props.children : []}
      {...CFNG_ENABLED ? CFRoutes.props.children : []}
      {...CENG_ENABLED ? CERoutes.props.children : []}
      {DASHBOARDRoutes.props.children}
      <Route path="*">
        <NotFoundPage />
      </Route>
    </Switch>
  )
}
