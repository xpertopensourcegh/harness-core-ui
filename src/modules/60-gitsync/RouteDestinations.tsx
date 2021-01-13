import React from 'react'
import { Route, Redirect, useParams } from 'react-router-dom'

import { RouteWithLayout } from '@common/router'
import routes from '@common/RouteDefinitions'
import { accountPathProps, orgPathProps } from '@common/utils/routeUtils'

import GitSyncRepoTab from '@gitsync/pages/views/repos/GitSyncRepoTab'
import GitSyncActivities from '@gitsync/pages/views/activities/GitSyncActivities'
import GitSyncEntityTab from '@gitsync/pages/views/entities/GitSyncEntityTab'
import GitSyncErrors from '@gitsync/pages/views/errors/GitSyncErrors'
import type { SidebarContext } from '@common/navigation/SidebarProvider'
import AccountSettingsSideNav from '@common/navigation/AccountSettingsSideNav/AccountSettingsSideNav'
import SessionToken from 'framework/utils/SessionToken'
import GitSyncPage from './pages/GitSyncPage'

const RedirectToGitSyncHome = (): React.ReactElement => {
  const accountId = SessionToken.accountId()
  const { orgIdentifier } = useParams()

  return (
    <Redirect
      to={orgIdentifier ? routes.toOrgGitSyncRepos({ accountId, orgIdentifier }) : routes.toGitSyncRepos({ accountId })}
    />
  )
}

const AccountSettingsSideNavProps: SidebarContext = {
  navComponent: AccountSettingsSideNav,
  subtitle: 'ACCOUNT',
  title: 'Settings'
}

export default (
  <>
    <Route
      exact
      path={[routes.toGitSync({ ...accountPathProps }), routes.toOrgGitSync({ ...accountPathProps, ...orgPathProps })]}
    >
      <RedirectToGitSyncHome />
    </Route>

    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
      path={[
        routes.toGitSyncRepos({ ...accountPathProps }),
        routes.toOrgGitSyncRepos({ ...accountPathProps, ...orgPathProps })
      ]}
      exact
    >
      <GitSyncPage>
        <GitSyncRepoTab />
      </GitSyncPage>
    </RouteWithLayout>

    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
      path={[
        routes.toGitSyncActivities({ ...accountPathProps }),
        routes.toOrgGitSyncActivities({ ...accountPathProps, ...orgPathProps })
      ]}
      exact
    >
      <GitSyncPage>
        <GitSyncActivities />
      </GitSyncPage>
    </RouteWithLayout>

    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
      path={[
        routes.toGitSyncEntities({ ...accountPathProps }),
        routes.toOrgGitSyncEntities({ ...accountPathProps, ...orgPathProps })
      ]}
      exact
    >
      <GitSyncPage>
        <GitSyncEntityTab />
      </GitSyncPage>
    </RouteWithLayout>

    <RouteWithLayout
      sidebarProps={AccountSettingsSideNavProps}
      path={[
        routes.toGitSyncErrors({ ...accountPathProps }),
        routes.toOrgGitSyncErrors({ ...accountPathProps, ...orgPathProps })
      ]}
      exact
    >
      <GitSyncPage>
        <GitSyncErrors />
      </GitSyncPage>
    </RouteWithLayout>
  </>
)
