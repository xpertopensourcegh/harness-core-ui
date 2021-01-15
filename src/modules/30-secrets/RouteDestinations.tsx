import React from 'react'

import { RouteWithLayout } from '@common/router'
import type { SidebarContext } from '@common/navigation/SidebarProvider'
import routes from '@common/RouteDefinitions'
import { accountPathProps, orgPathProps, secretPathProps } from '@common/utils/routeUtils'

import SecretsPage from '@secrets/pages/secrets/SecretsPage'
import SecretDetails from '@secrets/pages/secretDetails/SecretDetails'
import CreateSecretFromYamlPage from '@secrets/pages/createSecretFromYaml/CreateSecretFromYamlPage'
import AccountSettingsSideNav from '@common/navigation/AccountSettingsSideNav/AccountSettingsSideNav'
import ResourcesPage from '@common/pages/resources/ResourcesPage'

const AccountSettingsSideNavProps: SidebarContext = {
  navComponent: AccountSettingsSideNav,
  subtitle: 'ACCOUNT',
  title: 'Settings'
}

export default (
  <>
    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
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
      sidebarProps={AccountSettingsSideNavProps}
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
    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
      path={[
        routes.toCreateSecretFromYaml({ ...accountPathProps }),
        routes.toCreateSecretFromYaml({ ...accountPathProps, ...orgPathProps })
      ]}
      exact
    >
      <CreateSecretFromYamlPage />
    </RouteWithLayout>
  </>
)
