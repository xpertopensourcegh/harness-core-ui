import React from 'react'
import { useParams } from 'react-router-dom'
import { Layout } from '@wings-software/uicore'
import { useGet } from 'restful-react'
import routes from '@common/RouteDefinitions'

import type { AccountPathProps, ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { SidebarLink } from '@common/navigation/SideNav/SideNav'

import { useStrings } from 'framework/exports'

export default function DashboardsSideNav(): React.ReactElement {
  const { accountId } = useParams<AccountPathProps & Partial<ProjectPathProps>>()
  const { getString } = useStrings()

  const { data: dashboardList } = useGet({
    // Inferred from RestfulProvider in index.js
    path: 'insights/dashboards',
    queryParams: { accountId: accountId }
  })

  return (
    <Layout.Vertical spacing="small">
      <SidebarLink label="All Dashboards" to={routes.toCustomDasboardHome({ accountId })} />
      {dashboardList?.resource?.list?.length > 0 && (
        <section
          style={{
            marginTop: 'var(--spacing-medium)',
            fontSize: '12px',
            color: 'var(--grey-500)',
            letterSpacing: '1.1px'
          }}
        >
          {getString('dashboards.sideNav.byHarness')}
        </section>
      )}
      {dashboardList?.resource?.list?.length > 0 &&
        dashboardList?.resource?.list?.map((_dashboard: { title: string; id: string; type: string }) => {
          if (_dashboard.type === 'SHARED') {
            return (
              <SidebarLink
                key={_dashboard?.title}
                label={_dashboard?.title}
                to={routes.toViewCustomDashboard({ accountId, viewId: _dashboard?.id })}
              />
            )
          }
        })}

      {dashboardList?.resource?.list?.length > 0 && (
        <section
          style={{
            paddingTop: 'var(--spacing-medium)',
            borderTop: '1px solid var(--grey-600)',
            marginTop: 'var(--spacing-medium)',
            fontSize: '12px',
            color: 'var(--grey-500)',
            letterSpacing: '1.1px'
          }}
        >
          {getString('dashboards.sideNav.custom')}
        </section>
      )}
      {dashboardList?.resource?.list?.length > 0 &&
        dashboardList?.resource?.list?.map((_dashboard: { title: string; id: string; type: string }) => {
          if (_dashboard.type === 'ACCOUNT') {
            return (
              <SidebarLink
                key={_dashboard?.title}
                label={_dashboard?.title}
                to={routes.toViewCustomDashboard({ accountId, viewId: _dashboard?.id })}
              />
            )
          }
        })}
    </Layout.Vertical>
  )
}
