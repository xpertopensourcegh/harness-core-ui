import React from 'react'
import { Layout } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import routes from '@common/RouteDefinitions'
import { useFeatureFlags } from '@common/hooks/useFeatureFlag'
import type { AccountPathProps } from '@common/interfaces/RouteInterfaces'
import { useAppStore } from 'framework/AppStore/AppStoreContext'
import { useStrings } from 'framework/strings'
import { SidebarLink } from '../SideNav/SideNav'
import NavExpandable from '../NavExpandable/NavExpandable'

const AccountSetupMenu: React.FC = () => {
  const { getString } = useStrings()
  const { accountId } = useParams<AccountPathProps>()
  const { currentUserInfo } = useAppStore()
  const { NG_RBAC_ENABLED, NG_SHOW_DELEGATE } = useFeatureFlags()
  const { accounts } = currentUserInfo

  const createdFromNG = accounts?.find(account => account.uuid === accountId)?.createdFromNG

  return (
    <NavExpandable title={getString('common.accountSetup')} route={routes.toSetup({ accountId })}>
      <Layout.Vertical spacing="small">
        <SidebarLink exact label={getString('overview')} to={routes.toSetup({ accountId })} />
        <SidebarLink label={getString('authentication')} to={routes.toAuthenticationSettings({ accountId })} />
        <SidebarLink label={getString('connectorsLabel')} to={routes.toConnectors({ accountId })} />
        <SidebarLink label={getString('common.secrets')} to={routes.toSecrets({ accountId })} />
        {NG_SHOW_DELEGATE ? (
          <SidebarLink label={getString('delegate.delegates')} to={routes.toDelegates({ accountId })} />
        ) : null}
        {NG_RBAC_ENABLED ? (
          <SidebarLink to={routes.toAccessControl({ accountId })} label={getString('accessControl')} />
        ) : null}
        {createdFromNG && (
          <SidebarLink
            exact
            label={getString('common.subscriptions.title')}
            to={routes.toSubscriptions({ accountId })}
          />
        )}
        <SidebarLink label={getString('orgsText')} to={routes.toOrganizations({ accountId })} />
      </Layout.Vertical>
    </NavExpandable>
  )
}

export default AccountSetupMenu
