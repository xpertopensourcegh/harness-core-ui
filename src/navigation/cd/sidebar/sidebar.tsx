import { SidebarEntry, SidebarIdentifier } from 'framework/exports'
import { routeCDHome } from '../routes'
import { MenuCD } from './MenuCD'
import i18n from './sidebar.i18n'

export const Deployments: SidebarEntry = {
  sidebarId: SidebarIdentifier.CONTINUOUS_DEPLOYMENTS,
  title: i18n.cd,
  icon: {
    normal: 'cd-main',
    hover: 'cd-main',
    selected: 'cd-main'
  },
  url: routeCDHome.url,
  sidebarMenu: MenuCD
}
