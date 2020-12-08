import React from 'react'
import { Route } from 'react-router-dom'

import { RouteWithLayout } from '@common/router'
import SidebarProvider from '@common/navigation/SidebarProvider'
import routes from '@common/RouteDefinitions'
import { accountPathProps, orgPathProps, secretPathProps } from '@common/utils/routeUtils'

import SecretsPage from '@secrets/pages/secrets/SecretsPage'
import SecretDetails from '@secrets/pages/secretDetails/SecretDetails'
import CreateSecretFromYamlPage from '@secrets/pages/createSecretFromYaml/CreateSecretFromYamlPage'
import AccountSettingsSideNav from '@common/navigation/AccountSettingsSideNav/AccountSettingsSideNav'
import ResourcesPage from '@common/pages/resources/ResourcesPage'

export default (
  <SidebarProvider navComponent={AccountSettingsSideNav} subtitle="ACCOUNT" title="Settings">
    <Route path="/">
      <RouteWithLayout
        path={[
          routes.toResourcesSecretsListing({ ...accountPathProps }),
          routes.toOrgResourcesSecretsListing({ ...accountPathProps, ...orgPathProps })
        ]}
        exact
      >
        <ResourcesPage>
          <SecretsPage />
        </ResourcesPage>
      </RouteWithLayout>
      <RouteWithLayout
        path={[
          routes.toResourcesSecretDetails({ ...accountPathProps, ...secretPathProps }),
          routes.toOrgResourcesSecretDetails({
            ...accountPathProps,
            ...orgPathProps,
            ...secretPathProps
          })
        ]}
        exact
      >
        <SecretDetails />
      </RouteWithLayout>
      <RouteWithLayout path={routes.toCreateSecretFromYaml({ ...accountPathProps })} exact>
        <CreateSecretFromYamlPage />
      </RouteWithLayout>
    </Route>
  </SidebarProvider>
)
