import React from 'react'
import { Layout } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import routes from '@common/RouteDefinitions'
import { useFeatureFlags } from '@common/hooks/useFeatureFlag'
import type { OrgPathProps } from '@common/interfaces/RouteInterfaces'
import { useStrings } from 'framework/strings'
import { SidebarLink } from '../SideNav/SideNav'
import NavExpandable from '../NavExpandable/NavExpandable'

const OrgSetupMenu: React.FC = () => {
  const { getString } = useStrings()
  const params = useParams<OrgPathProps>()
  const { NG_SHOW_DELEGATE } = useFeatureFlags()

  return (
    <NavExpandable title={getString('common.orgSetup')} route={routes.toSetup(params)}>
      <Layout.Vertical spacing="small">
        <SidebarLink label={getString('connectorsLabel')} to={routes.toConnectors(params)} />
        <SidebarLink label={getString('common.secrets')} to={routes.toSecrets(params)} />
        <SidebarLink to={routes.toAccessControl(params)} label={getString('accessControl')} />
        {NG_SHOW_DELEGATE ? (
          <SidebarLink label={getString('delegate.delegates')} to={routes.toDelegates(params)} />
        ) : null}
      </Layout.Vertical>
    </NavExpandable>
  )
}

export default OrgSetupMenu
