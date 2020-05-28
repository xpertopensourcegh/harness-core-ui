import React from 'react'
import { Text, HarnessIcons, Container, Link, Layout, Color } from '@wings-software/uikit'
import css from './Menu.module.scss'
import i18n from './Menu.i18n'

export const Menu: React.FC = () => {
  const HarnessLogo = HarnessIcons['harness-logo-white']
  return (
    <Layout.Vertical spacing="huge">
      <Container className={css.logo}>
        <HarnessLogo height={24} />
      </Container>
      <Container>
        <Text font={{ align: 'center', weight: 'bold' }} color={Color.WHITE}>
          {i18n.dashboard}
        </Text>
        <Link withoutHref onClick={() => alert('Click')}>
          {i18n.addDashboard}
        </Link>
      </Container>
    </Layout.Vertical>
  )
}
