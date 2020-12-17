import React from 'react'
import { Route, useParams, Redirect } from 'react-router-dom'

import { RouteWithLayout } from '@common/router'
import SidebarProvider from '@common/navigation/SidebarProvider'
import routes from '@common/RouteDefinitions'
import { accountPathProps, orgPathProps, connectorPathProps } from '@common/utils/routeUtils'
import AccountSettingsSideNav from '@common/navigation/AccountSettingsSideNav/AccountSettingsSideNav'
import ConnectorsPage from '@connectors/pages/connectors/ConnectorsPage'
import ConnectorDetailsPage from '@connectors/pages/connectors/ConnectorDetailsPage'
import CreateConnectorFromYamlPage from '@connectors/pages/createConnectorFromYaml/CreateConnectorFromYamlPage'
import ResourcesPage from '@common/pages/resources/ResourcesPage'
import type { OrgPathProps } from '@common/interfaces/RouteInterfaces'

const RedirectToOrgResourcesHome = (): React.ReactElement => {
  const params = useParams<OrgPathProps>()

  return <Redirect to={routes.toOrgResourcesConnectors(params)} />
}

export default (
  <SidebarProvider navComponent={AccountSettingsSideNav} subtitle="ACCOUNT" title="Settings">
    <Route path="/">
      <Route exact path={routes.toOrgResources({ ...accountPathProps, ...orgPathProps })}>
        <RedirectToOrgResourcesHome />
      </Route>
      <RouteWithLayout
        path={[
          routes.toResourcesConnectors({ ...accountPathProps }),
          routes.toOrgResourcesConnectors({ ...accountPathProps, ...orgPathProps })
        ]}
        exact
      >
        <ResourcesPage>
          <ConnectorsPage />
        </ResourcesPage>
      </RouteWithLayout>
      <RouteWithLayout
        path={[
          routes.toResourcesConnectorDetails({ ...accountPathProps, ...connectorPathProps }),
          routes.toOrgResourcesConnectorDetails({
            ...accountPathProps,
            ...orgPathProps,
            ...connectorPathProps
          })
        ]}
        exact
      >
        <ConnectorDetailsPage />
      </RouteWithLayout>
      <RouteWithLayout path={routes.toCreateConnectorFromYaml({ ...accountPathProps })} exact>
        <CreateConnectorFromYamlPage />
      </RouteWithLayout>
    </Route>
  </SidebarProvider>
)
