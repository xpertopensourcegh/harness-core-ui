import React from 'react'
import { Text, HarnessIcons, Container, Link, Layout } from '@wings-software/uikit'
import css from './Menu.module.scss'
import i18n from './Menu.i18n'

export const Menu: React.FC = () => {
  const HarnessLogo = HarnessIcons['harness-logo-white']
  return (
    <Layout.Vertical spacing="xxxlarge">
      <Container className={css.logo}>
        <HarnessLogo height={24} width={200} />
      </Container>
      <Container>
        <Text
          className={css.dashboardTitle}
          icon="grid-view" /* TODO: replace icon */
          font={{ align: 'center', weight: 'bold' }}
        >
          <span>{i18n.dashboard}</span>
        </Text>
        <Container padding="xlarge" className={css.menuContent}>
          <Link withoutHref onClick={() => alert('Click')}>
            {i18n.addDashboard}
          </Link>
        </Container>
      </Container>
    </Layout.Vertical>
  )
}
