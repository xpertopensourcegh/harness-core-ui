import React from 'react'
import { Text, HarnessIcons, Container, Link, Layout } from '@wings-software/uikit'
import i18n from './MenuDashboard.i18n'
import css from './MenuDashboard.module.scss'

export const MenuDashboard: React.FC = () => {
  const HarnessLogo = HarnessIcons['harness-logo-white']
  return (
    <Layout.Vertical spacing="xxxlarge">
      <Container className={css.logo}>
        <HarnessLogo height={24} width={200} />
      </Container>
      <Container>
        <Text className={css.dashboardTitle} icon="grid-view" font={{ align: 'center', weight: 'bold' }}>
          <span>{i18n.dashboard}</span>
        </Text>
        <Container padding="xlarge" className={css.menuContent}>
          <Link withoutHref onClick={() => alert('To be implemented...')}>
            {i18n.addDashboard}
          </Link>
        </Container>
      </Container>
    </Layout.Vertical>
  )
}
