import { SidebarEntry, SidebarIdentifier } from 'framework/exports'
import { routeCIHome } from '../routes'
import { MenuCI } from './MenuCI'
import i18n from './sidebar.i18n'

export const CIHome: SidebarEntry = {
  sidebarId: SidebarIdentifier.CONTINUOUS_INTEGRATION,
  title: i18n.ci,
  icon: {
    normal: 'ci-main',
    hover: 'ci-main',
    selected: 'ci-main'
  },
  url: routeCIHome.url,
  sidebarMenu: MenuCI
}
