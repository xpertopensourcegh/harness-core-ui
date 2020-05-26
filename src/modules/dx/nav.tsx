import { linkTo, NavEntry, NavIdentifier } from 'framework'
import { Menu } from './menu/Menu'
import i18n from './module.i18n'
import { routeDashboard } from './routes'

export const navDashboard: NavEntry = {
  navId: NavIdentifier.DASHBOARD,
  title: i18n.dashboard,
  icon: {
    normal: 'harness',
    hover: 'harness',
    selected: 'harness'
  },
  url: (_urlParams, _urlQueries) => {
    return linkTo(routeDashboard)
  },
  menu: Menu
}
