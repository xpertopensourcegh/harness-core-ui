import React from 'react'
import { useParams } from 'react-router-dom'
import { Callout } from '@blueprintjs/core'
import { Page } from '@common/exports'
import RBACTooltip from '@rbac/components/RBACTooltip/RBACTooltip'
import { useGetAuthenticationSettings } from 'services/cd-ng'
import { useStrings } from 'framework/strings'
import type { AccountPathProps } from '@common/interfaces/RouteInterfaces'
import AccountAndOAuth from '@auth-settings/pages/Configuration/AccountAndOAuth/AccountAndOAuth'
import SAMLProvider from '@auth-settings/pages/Configuration/SAMLProvider/SAMLProvider'
import RestrictEmailDomains from '@auth-settings/pages/Configuration/RestrictEmailDomains/RestrictEmailDomains'
import { usePermission } from '@rbac/hooks/usePermission'
import { ResourceType } from '@rbac/interfaces/ResourceType'
import { PermissionIdentifier } from '@rbac/interfaces/PermissionIdentifier'
import css from './Configuration.module.scss'

export interface PermissionRequest {
  resourceScope: {
    accountIdentifier: string
  }
  resource: {
    resourceType: ResourceType
  }
}

const Configuration: React.FC = () => {
  const params = useParams<AccountPathProps>()
  const { accountId } = params
  const { getString } = useStrings()

  const permissionRequest = {
    resourceScope: {
      accountIdentifier: accountId
    },
    resource: {
      resourceType: ResourceType.AUTHSETTING
    }
  }

  const [canEdit] = usePermission(
    {
      ...permissionRequest,
      permissions: [PermissionIdentifier.EDIT_AUTHSETTING]
    },
    []
  )

  const {
    data,
    loading: fetchingAuthSettings,
    error: errorWhileFetchingAuthSettings,
    refetch: refetchAuthSettings
  } = useGetAuthenticationSettings({
    queryParams: {
      accountIdentifier: accountId
    }
  })

  return (
    <React.Fragment>
      <Page.Header title={`${getString('authentication')}: ${getString('configuration')}`} />
      <Page.Body
        loading={fetchingAuthSettings}
        error={
          (errorWhileFetchingAuthSettings?.data as Error)?.message ||
          errorWhileFetchingAuthSettings?.message ||
          (data?.resource ? undefined : getString('somethingWentWrong'))
        }
        retryOnError={() => refetchAuthSettings()}
      >
        {data?.resource && (
          <React.Fragment>
            {!canEdit && (
              <Callout icon={null} className={css.callout}>
                <RBACTooltip
                  permission={PermissionIdentifier.EDIT_AUTHSETTING}
                  resourceType={permissionRequest.resource.resourceType}
                  resourceScope={permissionRequest.resourceScope}
                />
              </Callout>
            )}
            <AccountAndOAuth authSettings={data.resource} refetchAuthSettings={refetchAuthSettings} canEdit={canEdit} />
            <SAMLProvider
              authSettings={data.resource}
              refetchAuthSettings={refetchAuthSettings}
              permissionRequest={permissionRequest}
              canEdit={canEdit}
            />
            <RestrictEmailDomains
              whitelistedDomains={data.resource.whitelistedDomains || []}
              refetchAuthSettings={refetchAuthSettings}
              canEdit={canEdit}
            />
          </React.Fragment>
        )}
      </Page.Body>
    </React.Fragment>
  )
}

export default Configuration
