import { Layout } from '@wings-software/uikit'
import React from 'react'
import { Sidebar } from 'framework/exports'
import i18n from './MenuUserProfile.i18n'

export const MenuUserProfile: React.FC = () => {
  return (
    <Layout.Vertical spacing="medium">
      <Sidebar.Title upperText={i18n.user} lowerText={i18n.profile} />
    </Layout.Vertical>
  )
}
