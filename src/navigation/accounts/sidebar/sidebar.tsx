import { SidebarEntry, SidebarIdentifier } from 'framework/exports'
import { routeAdmin } from '../routes'
import { MenuAccount } from './MenuAccount'
import i18n from './sidebar.i18n'

export const Account: SidebarEntry = {
  sidebarId: SidebarIdentifier.ACCOUNT,
  title: i18n.settings,
  icon: {
    normal: 'nav-settings',
    hover: 'nav-settings-hover',
    selected: 'nav-settings-selected'
  },
  position: 'BOTTOM',
  url: routeAdmin.url,
  sidebarMenu: MenuAccount
}
