import { SidebarEntry, SidebarIdentifier } from 'framework/exports'
import { routeCDHome } from '../routes'
import { MenuCD } from './MenuCD'
import i18n from './sidebar.i18n'

export const Deployments: SidebarEntry = {
  sidebarId: SidebarIdentifier.CONTINUOUS_DEPLOYMENTS,
  title: i18n.cd,
  icon: {
    normal: 'nav-cd',
    hover: 'nav-cd-hover',
    selected: 'nav-cd-selected'
  },
  url: routeCDHome.url,
  sidebarMenu: MenuCD
}
