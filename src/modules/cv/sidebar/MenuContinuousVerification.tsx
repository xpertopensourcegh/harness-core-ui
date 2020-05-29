import { Container, Layout } from '@wings-software/uikit'
import { linkTo, Sidebar } from 'framework/exports'
import React from 'react'
import { routeCVHome } from '../routes'
import i18n from './MenuContinuousVerification.i18n'

export const MenuContinuousVerification: React.FC = () => {
  return (
    <Layout.Vertical spacing="medium">
      <Sidebar.Title upperText={i18n.continuous} lowerText={i18n.verification} />
      <Container style={{ marginTop: '25px' }}>
        <Layout.Vertical>
          <Sidebar.Link href={linkTo(routeCVHome)} label={i18n.home} icon="main-flag" />
          <Sidebar.Link href={linkTo(routeCVHome)} label={i18n.service} icon="main-depricate" selected />
          <Sidebar.Link href={linkTo(routeCVHome)} label={i18n.datasource} icon="main-help" />
          <Sidebar.Link href={linkTo(routeCVHome)} label={i18n.datasource} icon="main-help" />
          <Sidebar.Link href={linkTo(routeCVHome)} label={i18n.home} icon="main-flag" />
        </Layout.Vertical>
      </Container>
    </Layout.Vertical>
  )
}
