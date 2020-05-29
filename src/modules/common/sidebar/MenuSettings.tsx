import { Layout } from '@wings-software/uikit'
import { Sidebar } from 'framework/exports'
import React from 'react'
import i18n from './MenuSettings.i18n'

export const MenuSettings: React.FC = () => {
  return (
    <Layout.Vertical spacing="medium">
      <Sidebar.Title upperText={i18n.account} lowerText={i18n.settings} />
    </Layout.Vertical>
  )
}
