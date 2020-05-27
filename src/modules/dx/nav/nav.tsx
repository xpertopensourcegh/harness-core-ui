import { linkTo, NavEntry, NavIdentifier } from 'framework'
import { Menu } from './Menu'
import i18n from './nav.i18n'
import { routeDashboard } from '../routes'

export const navDashboard: NavEntry = {
  navId: NavIdentifier.DASHBOARD,
  title: i18n.dashboard,
  icon: {
    normal: 'harness',
    hover: 'harness',
    selected: 'harness'
  },
  url: _routeParams => {
    return linkTo(routeDashboard)
  },
  menu: Menu
}
