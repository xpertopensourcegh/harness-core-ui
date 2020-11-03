import { SidebarEntry, SidebarIdentifier } from 'framework/exports'
import { routeCVHome } from '../routes'
import { MenuCV } from './MenuCV'
import i18n from './sidebar.i18n'

export const CVDashboard: SidebarEntry = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  title: i18n.title,
  icon: {
    normal: 'cv-main',
    hover: 'cv-main',
    selected: 'cv-main'
  },
  url: routeCVHome.url,
  sidebarMenu: MenuCV
}
