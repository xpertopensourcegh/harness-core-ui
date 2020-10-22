import { SidebarEntry, SidebarIdentifier } from 'framework/exports'
import { routeCVHome } from '../routes'
import { MenuCV } from './MenuCV'
import i18n from './sidebar.i18n'

export const CVDashboard: SidebarEntry = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  title: i18n.title,
  icon: {
    normal: 'nav-cv',
    hover: 'nav-cv-hover',
    selected: 'nav-cv-selected'
  },
  url: routeCVHome.url,
  sidebarMenu: MenuCV
}
