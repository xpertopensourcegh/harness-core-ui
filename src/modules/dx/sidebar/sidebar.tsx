import { linkTo, SidebarEntry, SidebarIdentifier } from 'framework/exports'
import { MenuDashboard } from './MenuDashboard'
import i18n from './sidebar.i18n'
import { routeDashboard } from '../routes'

export const Dashboard: SidebarEntry = {
  sidebarId: SidebarIdentifier.DASHBOARD,
  title: i18n.dashboard,
  icon: {
    normal: 'harness',
    hover: 'harness',
    selected: 'harness'
  },
  url: _routeParams => {
    return linkTo(routeDashboard)
  },
  sidebarMenu: MenuDashboard
}
