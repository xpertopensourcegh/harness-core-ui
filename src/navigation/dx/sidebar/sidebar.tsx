import { SidebarEntry, SidebarIdentifier } from 'framework/exports'
import { MenuDashboard } from './MenuDashboard'
import i18n from './sidebar.i18n'
import { routeDashboard } from '../routes'

export const Dashboard: SidebarEntry = {
  sidebarId: SidebarIdentifier.DASHBOARD,
  title: i18n.dashboard,
  icon: {
    normal: 'nav-harness',
    hover: 'nav-harness-hover',
    selected: 'nav-harness'
  },
  url: routeDashboard.url,
  sidebarMenu: MenuDashboard
}
