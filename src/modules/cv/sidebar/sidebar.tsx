import { linkTo, SidebarEntry, SidebarIdentifier } from 'framework/exports'
import { routeCVHome } from '../routes'
import { MenuContinuousVerification } from './MenuContinuousVerification'
import i18n from './sidebar.i18n'

export const CVDashboard: SidebarEntry = {
  sidebarId: SidebarIdentifier.CONTINUOUS_VERIFICATION,
  title: i18n.title,
  icon: {
    normal: 'cloud',
    hover: 'cloud',
    selected: 'cloud'
  },
  url: _routeParams => {
    return linkTo(routeCVHome)
  },
  sidebarMenu: MenuContinuousVerification
}
