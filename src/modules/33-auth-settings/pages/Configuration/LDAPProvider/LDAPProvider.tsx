/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Free Trial 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/05/PolyForm-Free-Trial-1.0.0.txt.
 */

import React, { Dispatch, SetStateAction, useState } from 'react'
import cx from 'classnames'
import { useParams } from 'react-router-dom'
import {
  Radio,
  Container,
  Collapse,
  Card,
  Text,
  Button,
  Popover,
  ButtonVariation,
  Utils,
  useConfirmationDialog
} from '@wings-software/uicore'
import { Color, FontVariation } from '@harness/design-system'
import { Menu, MenuItem } from '@blueprintjs/core'
import { useToaster } from '@common/components'
import { String, useStrings } from 'framework/strings'
import type { AccountPathProps } from '@common/interfaces/RouteInterfaces'
import {
  AuthenticationSettingsResponse,
  LDAPSettings,
  syncLdapGroupsPromise,
  useDeleteLdapSettings
} from 'services/cd-ng'
import { AuthenticationMechanisms } from '@auth-settings/constants/utils'
import RbacMenuItem from '@rbac/components/MenuItem/MenuItem'
import { PermissionIdentifier } from '@rbac/interfaces/PermissionIdentifier'
import type { PermissionRequest } from '@auth-settings/pages/Configuration/Configuration'
import { useFeature } from '@common/hooks/useFeatures'
import { FeatureIdentifier } from 'framework/featureStore/FeatureIdentifier'
import useRBACError from '@rbac/utils/useRBACError/useRBACError'
import { useFeatureFlag } from '@common/hooks/useFeatureFlag'
import { FeatureFlag } from '@common/featureFlags'
import { FeatureWarningTooltip } from '@common/components/FeatureWarning/FeatureWarningWithTooltip'
import useLdapTestConfigurationProvider from '@auth-settings/modals/LdapTestConfiguration/useLdapTestConfigurationProvider'
import css from './LDAPProvider.module.scss'
import cssConfiguration from '@auth-settings/pages/Configuration/Configuration.module.scss'

interface Props {
  authSettings: AuthenticationSettingsResponse
  refetchAuthSettings: () => void
  permissionRequest: PermissionRequest
  canEdit: boolean
  setUpdating: Dispatch<SetStateAction<boolean>>
}

const LDAPProvider: React.FC<Props> = ({ authSettings, refetchAuthSettings, permissionRequest, canEdit }) => {
  const { getRBACErrorMessage } = useRBACError()
  const { getString } = useStrings()
  const { showSuccess, showError } = useToaster()
  const { accountId } = useParams<AccountPathProps>()
  const ldapEnabledForAuth = authSettings.authenticationMechanism === AuthenticationMechanisms.LDAP
  const ldapSettings = authSettings.ngAuthSettings?.find(
    settings => settings.settingsType === AuthenticationMechanisms.LDAP
  ) as LDAPSettings | undefined

  const { enabled: featureEnabled } = useFeature({
    featureRequest: {
      featureName: FeatureIdentifier.LDAP_SUPPORT
    }
  })

  const [isLdapSyncInProgress, setIsLdapSyncInProgress] = useState<boolean>(false)

  const isNgLDAPFFEnabled = useFeatureFlag(FeatureFlag.NG_ENABLE_LDAP_CHECK)
  const onSuccess = (): void => {
    refetchAuthSettings()
  }

  const { openLdapTestModal } = useLdapTestConfigurationProvider({ onSuccess })

  const { mutate: deleteLdapSettings, loading: deletingLdapSettings } = useDeleteLdapSettings({
    queryParams: {
      accountIdentifier: accountId
    }
  })

  const { openDialog: confirmLdapSettingsDelete } = useConfirmationDialog({
    titleText: getString('authSettings.deleteLdapProvider'),
    contentText: (
      <String
        useRichText
        stringID="authSettings.deleteLdapProviderDescription"
        vars={{ displayName: ldapSettings?.displayName }}
      />
    ),
    confirmButtonText: getString('confirm'),
    cancelButtonText: getString('cancel'),
    onCloseDialog: async isConfirmed => {
      /* istanbul ignore else */ if (isConfirmed) {
        try {
          const deleted = await deleteLdapSettings()
          /* istanbul ignore else */ if (deleted) {
            refetchAuthSettings()
            showSuccess(getString('authSettings.ldapProviderDeleted'), 5000)
          }
        } catch (e) {
          /* istanbul ignore next */ showError(getRBACErrorMessage(e), 5000)
        }
      }
    }
  })

  if (!isNgLDAPFFEnabled) {
    return null
  }

  return (
    <Container margin="xlarge" background={Color.WHITE}>
      {ldapSettings ? (
        <Collapse
          isOpen={featureEnabled}
          collapseHeaderClassName={cx(cssConfiguration.collapseHeaderClassName, cssConfiguration.height60)}
          collapseClassName={cssConfiguration.collapseClassName}
          collapsedIcon="main-chevron-down"
          expandedIcon="main-chevron-up"
          heading={
            <Utils.WrapOptionalTooltip
              tooltip={
                !featureEnabled ? <FeatureWarningTooltip featureName={FeatureIdentifier.LDAP_SUPPORT} /> : undefined
              }
            >
              <Container margin={{ left: 'xlarge' }}>
                <Radio
                  checked={ldapEnabledForAuth}
                  font={{ weight: 'bold', size: 'normal' }}
                  color={Color.GREY_900}
                  label={getString('authSettings.loginViaLDAP')}
                  onChange={() => {
                    openLdapTestModal()
                  }}
                  disabled={!featureEnabled || !canEdit}
                />
              </Container>
            </Utils.WrapOptionalTooltip>
          }
        >
          <Container padding={{ bottom: 'large' }}>
            <Card className={css.card}>
              <Container margin={{ left: 'xlarge' }}>
                <Radio font={{ weight: 'bold', size: 'normal' }} checked={ldapEnabledForAuth} readOnly />
              </Container>
              <Text font={{ variation: FontVariation.CARD_TITLE }} className={css.flexGrowFull}>
                {ldapSettings.displayName}
              </Text>
              <Button
                text={getString('test')}
                variation={ButtonVariation.SECONDARY}
                onClick={() => {
                  openLdapTestModal()
                }}
                data-testid="ldap-config-test"
              />
              <Popover
                interactionKind="click"
                position="left-top"
                content={
                  <Menu data-testid="ldap-popover-menu">
                    <MenuItem text={getString('edit')} disabled={!canEdit} />
                    <RbacMenuItem
                      text={getString('delete')}
                      onClick={confirmLdapSettingsDelete}
                      permission={{
                        ...permissionRequest,
                        permission: PermissionIdentifier.DELETE_AUTHSETTING
                      }}
                      disabled={deletingLdapSettings}
                      data-testid="ldap-delete-config"
                    />
                    <MenuItem
                      text={getString('authSettings.ldap.syncUserGroups')}
                      data-testid="ldap-group-sync"
                      onClick={async () => {
                        try {
                          setIsLdapSyncInProgress(true)
                          const { resource } = await syncLdapGroupsPromise({
                            queryParams: {
                              accountIdentifier: accountId
                            }
                          })
                          if (resource) {
                            showSuccess(getString('authSettings.ldap.syncUserGroupsResult.success'), 5000)
                          } else {
                            showError(getString('authSettings.ldap.syncUserGroupsResult.fail'), 5000)
                          }
                        } catch (e) {
                          showError(getString('authSettings.ldap.syncUserGroupsResult.fail'), 5000)
                        } finally {
                          setIsLdapSyncInProgress(false)
                        }
                      }}
                      disabled={!canEdit || isLdapSyncInProgress}
                    />
                  </Menu>
                }
              >
                <Button minimal icon="Options" data-testid="provider-button" variation={ButtonVariation.ICON} />
              </Popover>
            </Card>
          </Container>
        </Collapse>
      ) : (
        <Utils.WrapOptionalTooltip
          tooltip={!featureEnabled ? <FeatureWarningTooltip featureName={FeatureIdentifier.LDAP_SUPPORT} /> : undefined}
        >
          <Card className={css.cardWithRadioBtn}>
            <Container margin={{ left: 'xlarge', top: 'xsmall' }}>
              <Radio
                checked={false}
                font={{ weight: 'semi-bold', size: 'normal' }}
                color={Color.PRIMARY_7}
                label={getString('authSettings.ldap.addLdap')}
                disabled={!featureEnabled || !canEdit}
              />
            </Container>
          </Card>
        </Utils.WrapOptionalTooltip>
      )}
    </Container>
  )
}

export default LDAPProvider
