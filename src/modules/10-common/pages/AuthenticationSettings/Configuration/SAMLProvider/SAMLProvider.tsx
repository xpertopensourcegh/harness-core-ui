import React from 'react'
import cx from 'classnames'
import { Radio, Container, Accordion, Color, Card, Text, Button, Popover, IconName } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import configCss from '@common/pages/AuthenticationSettings/Configuration/Configuration.module.scss'
import css from '@common/pages/AuthenticationSettings/Configuration/SAMLProvider/SAMLProvider.module.scss'

interface Toolbar {
  name: string
  icon: IconName
  authorizationEnabled: boolean
  groupAttributeName?: string
}

const samlProviders: Toolbar[] = [
  {
    name: 'OKTA SSO',
    icon: 'github',
    authorizationEnabled: true,
    groupAttributeName: 'MyGroupName'
  },
  {
    name: 'OKTA Backup',
    icon: 'github',
    authorizationEnabled: false
  }
]

const Toolbar: React.FC<Toolbar> = ({ name, icon, authorizationEnabled, groupAttributeName }) => {
  const { getString } = useStrings()

  return (
    <Card className={cx(css.card, configCss.shadow)}>
      <Container margin={{ left: 'xlarge' }}>
        <Radio checked={authorizationEnabled} font={{ weight: 'bold', size: 'normal' }} />
      </Container>
      <Text icon={icon} color={Color.GREY_800} font={{ weight: 'bold' }} width="20%">
        {name}
      </Text>
      <Text color={Color.GREY_800} width={authorizationEnabled ? '50%' : '80%'}>
        {authorizationEnabled ? (
          <span>
            {getString('authenticationSettings.authorizationEnabledFor')}{' '}
            <Text font={{ weight: 'semi-bold' }} color={Color.GREY_800} inline>
              {groupAttributeName}
            </Text>
          </span>
        ) : (
          getString('authenticationSettings.authorizationNotEnabled')
        )}
      </Text>
      {authorizationEnabled && (
        <Text intent="success" icon="dot" color={Color.GREY_800} iconProps={{ size: 22 }} width="30%">
          {getString('connected')}
        </Text>
      )}
      <Button minimal intent="primary" className={css.testButton}>
        {getString('test')}
      </Button>
      <Popover
        interactionKind="hover"
        position="left-top"
        content={<Container padding="small">{getString('authenticationSettings.options')}</Container>}
      >
        <Button minimal icon="Options" />
      </Popover>
    </Card>
  )
}

const SAMLProvider: React.FC = () => {
  const { getString } = useStrings()

  const AddSAMLButton = (): React.ReactElement => {
    return (
      <Button
        minimal
        inline
        intent="primary"
        width="max-content"
        className={css.button}
        icon="small-plus"
        iconProps={{ size: 20 }}
      >
        {getString('authenticationSettings.SAMLProvider')}
      </Button>
    )
  }

  const summary = (
    <Container margin={{ left: 'xlarge' }}>
      <Radio font={{ weight: 'bold', size: 'normal' }} color={Color.GREY_900}>
        {samlProviders.length ? getString('authenticationSettings.loginViaSAML') : <AddSAMLButton />}
      </Radio>
    </Container>
  )

  const details = (
    <React.Fragment>
      {samlProviders.map(provider => (
        <Toolbar key={provider.name} {...provider} />
      ))}
      <Container margin={{ left: 'xxxlarge' }}>
        <AddSAMLButton />
      </Container>
    </React.Fragment>
  )

  return (
    <Container margin="xlarge" border={{ radius: 4 }}>
      <Accordion
        activeId="saml-providers"
        summaryClassName={configCss.summary}
        panelClassName={configCss.shadow}
        detailsClassName={configCss.details}
      >
        <Accordion.Panel id="saml-provider-panel" summary={summary} details={details} />
      </Accordion>
    </Container>
  )
}

export default SAMLProvider
