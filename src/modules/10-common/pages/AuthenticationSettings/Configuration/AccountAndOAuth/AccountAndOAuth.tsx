import React from 'react'
import { Radio, Container, Color, Layout, Collapse } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import type { AuthenticationSettingsResponse } from 'services/cd-ng'
import { AuthenticationMechanisms } from '@common/constants/Utils'
import HarnessAccount from '@common/pages/AuthenticationSettings/Configuration/AccountAndOAuth/HarnessAccount/HarnessAccount'
import PublicOAuthProviders from '@common/pages/AuthenticationSettings/Configuration/AccountAndOAuth/OAuthProviders/PublicOAuthProviders'
import cssConfiguration from '@common/pages/AuthenticationSettings/Configuration/Configuration.module.scss'

interface Props {
  authSettings: AuthenticationSettingsResponse
  refetchAuthSettings: () => void
}

const AccountAndOAuth: React.FC<Props> = ({ authSettings, refetchAuthSettings }) => {
  const { getString } = useStrings()
  const userPasswordOrOauthEnabled =
    authSettings.authenticationMechanism === AuthenticationMechanisms.USER_PASSWORD ||
    /* istanbul ignore next */ authSettings.authenticationMechanism === AuthenticationMechanisms.OAUTH

  return (
    <Container margin="xlarge" background={Color.WHITE}>
      <Collapse
        isOpen={userPasswordOrOauthEnabled}
        collapseHeaderClassName={cssConfiguration.collapseHeaderClassName}
        collapseClassName={cssConfiguration.collapseClassName}
        collapsedIcon="main-chevron-down"
        expandedIcon="main-chevron-up"
        heading={
          <Container margin={{ left: 'xlarge' }}>
            <Radio
              label={getString('common.authSettings.accountOrOAuthLogin')}
              font={{ weight: 'bold', size: 'normal' }}
              color={Color.GREY_900}
              checked={userPasswordOrOauthEnabled}
            />
          </Container>
        }
      >
        <Layout.Vertical spacing="large" margin={{ left: 'xxlarge', right: 'xxlarge' }}>
          <HarnessAccount authSettings={authSettings} refetchAuthSettings={refetchAuthSettings} />
          <PublicOAuthProviders authSettings={authSettings} refetchAuthSettings={refetchAuthSettings} />
          <div />
        </Layout.Vertical>
      </Collapse>
    </Container>
  )
}

export default AccountAndOAuth
