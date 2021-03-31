import React from 'react'
import cx from 'classnames'
import { NestedAccordionPanel, Switch, Text, Container, Card, Color } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import { OAuthProviders } from '@common/constants/OAuthProviders'
import configCss from '@common/pages/AuthenticationSettings/Configuration/Configuration.module.scss'
import accAndOAuthCss from '@common/pages/AuthenticationSettings/Configuration/AccountAndOAuth/AccountAndOAuth.module.scss'
import css from '@common/pages/AuthenticationSettings/Configuration/AccountAndOAuth/OAuthProviders/PublicOAuthProviders.module.scss'

const PublicOAuthProviders: React.FC = () => {
  const { getString } = useStrings()

  const summary = (
    <Switch
      label={getString('authenticationSettings.usePublicOAuth')}
      defaultChecked
      font={{ weight: 'semi-bold', size: 'normal' }}
      color={Color.GREY_800}
    />
  )

  const Details: React.FC = () => {
    return (
      <Container flex={{ align: 'center-center' }} className={css.container} height={185}>
        {OAuthProviders.sort((a, b) => a.name.localeCompare(b.name)).map(provider => {
          const label = (
            <Text icon={provider.iconName} inline color={Color.BLACK}>
              {provider.name}
            </Text>
          )
          return (
            <Card key={provider.type} className={css.card}>
              <Switch labelElement={label} defaultChecked />
            </Card>
          )
        })}
      </Container>
    )
  }

  return (
    <NestedAccordionPanel
      isDefaultOpen
      id="oauth-providers"
      summary={summary}
      details={<Details />}
      summaryClassName={configCss.nestedSummary}
      panelClassName={cx(configCss.shadow, accAndOAuthCss.panel)}
      detailsClassName={configCss.nestedDetails}
    />
  )
}

export default PublicOAuthProviders
