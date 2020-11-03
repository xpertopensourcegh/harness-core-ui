import { SidebarEntry, SidebarIdentifier } from 'framework/exports'
import { routeCFHome } from '../routes'
import { MenuCF } from './MenuCF'
import i18n from './sidebar.i18n'

export const CFHome: SidebarEntry = {
  sidebarId: SidebarIdentifier.CONTINUOUS_FEATURES,
  title: i18n.cf,
  icon: {
    normal: 'cf-main',
    hover: 'cf-main',
    selected: 'cf-main'
  },
  url: routeCFHome.url,
  sidebarMenu: MenuCF
}
