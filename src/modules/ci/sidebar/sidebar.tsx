import { SidebarEntry, SidebarIdentifier } from 'framework/exports'
import { routeCIHome } from '../routes'
import { MenuCI } from './MenuCI'
import i18n from './sidebar.i18n'

export const CIHome: SidebarEntry = {
  sidebarId: SidebarIdentifier.CONTINUOUS_INTEGRATION,
  title: i18n.ci,
  icon: {
    normal: 'placeholder',
    hover: 'placeholder-hover',
    selected: 'placeholder-selected'
  },
  url: routeCIHome.url,
  sidebarMenu: MenuCI
}
