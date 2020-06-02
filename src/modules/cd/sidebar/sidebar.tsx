import { linkTo, SidebarEntry, SidebarIdentifier } from 'framework/exports'
import { routeDeployments } from '../routes'
import { MenuDeployments } from './MenuDeployments'
import i18n from './sidebar.i18n'

export const Deployments: SidebarEntry = {
  sidebarId: SidebarIdentifier.DEPLOYMENTS,
  title: i18n.deployments,
  icon: {
    normal: 'nav-cd',
    hover: 'nav-cd-hover',
    selected: 'nav-cd-selected'
  },
  url: _routeParams => {
    return linkTo(routeDeployments)
  },
  sidebarMenu: MenuDeployments
}
