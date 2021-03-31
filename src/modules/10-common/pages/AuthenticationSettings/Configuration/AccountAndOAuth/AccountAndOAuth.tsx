import React from 'react'
import { Radio, Container, NestedAccordionProvider, NestedAccordionPanel, Color, Layout } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import HarnessAccount from '@common/pages/AuthenticationSettings/Configuration/AccountAndOAuth/HarnessAccount/HarnessAccount'
import PublicOAuthProviders from '@common/pages/AuthenticationSettings/Configuration/AccountAndOAuth/OAuthProviders/PublicOAuthProviders'
import configCss from '@common/pages/AuthenticationSettings/Configuration/Configuration.module.scss'

const AccountAndOAuth: React.FC = () => {
  const { getString } = useStrings()

  const summary = (
    <Container margin={{ left: 'xlarge' }}>
      <Radio
        label={getString('authenticationSettings.accountOrOAuthLogin')}
        font={{ weight: 'bold', size: 'normal' }}
        color={Color.GREY_900}
      />
    </Container>
  )

  return (
    <Container margin="xlarge" border={{ radius: 4 }}>
      <NestedAccordionProvider>
        <NestedAccordionPanel
          isDefaultOpen
          id="account-oauth-providers"
          summary={summary}
          details={
            <Layout.Vertical spacing="xlarge">
              <HarnessAccount />
              <PublicOAuthProviders />
            </Layout.Vertical>
          }
          summaryClassName={configCss.summary}
          panelClassName={configCss.shadow}
          detailsClassName={configCss.details}
        />
      </NestedAccordionProvider>
    </Container>
  )
}

export default AccountAndOAuth
