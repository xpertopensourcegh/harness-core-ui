import { linkTo, NavEntry, NavIdentifier } from 'framework'
import { routeDeployments } from '../routes'
import { Menu } from './Menu'
import i18n from './nav.i18n'

export const navDeployments: NavEntry = {
  navId: NavIdentifier.DEPLOYMENTS,
  title: i18n.deployments,
  icon: {
    normal: 'step-chart',
    hover: 'step-chart',
    selected: 'step-chart'
  },
  url: _routeParams => {
    return linkTo(routeDeployments)
  },
  menu: Menu
}
