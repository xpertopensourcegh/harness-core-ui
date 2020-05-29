import { Layout } from '@wings-software/uikit'
import { Sidebar } from 'framework/exports'
import React from 'react'
import i18n from './MenuDeployments.i18n'

export const MenuDeployments: React.FC = () => {
  return (
    <Layout.Vertical spacing="medium">
      <Sidebar.Title upperText={i18n.continuous} lowerText={i18n.deployments} />
    </Layout.Vertical>
  )
}
