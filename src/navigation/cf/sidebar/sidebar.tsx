import { SidebarEntry, SidebarIdentifier } from 'framework/exports'
import { routeCFHome } from '../routes'
import { MenuCF } from './MenuCF'
import i18n from './sidebar.i18n'

export const CFHome: SidebarEntry = {
  sidebarId: SidebarIdentifier.CONTINUOUS_FEATURES,
  title: i18n.cf,
  icon: {
    normal: 'nav-cd',
    hover: 'nav-cd-hover',
    selected: 'nav-cd-selected'
  },
  url: routeCFHome.url,
  sidebarMenu: MenuCF
}
