import { linkTo, SidebarEntry, SidebarIdentifier } from 'framework/exports'
import { routeCVDashboard } from '../routes'
import { MenuCVDashboard } from './MenuCVDashboard'
import i18n from './sidebar.i18n'

export const CVDashboard: SidebarEntry = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  title: i18n.title,
  icon: {
    normal: 'nav-cv',
    hover: 'nav-cv-hover',
    selected: 'nav-cv-selected'
  },
  url: _routeParams => {
    return linkTo(routeCVDashboard)
  },
  sidebarMenu: MenuCVDashboard
}
