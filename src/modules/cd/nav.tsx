import { linkTo, NavEntry, NavIdentifier } from 'framework'
import { routeDeployments } from './routes'
import { Menu } from './menu/Menu'
import i18n from './module.i18n'

export const navDeployments: NavEntry = {
  navId: NavIdentifier.DEPLOYMENTS,
  title: i18n.deployments,
  icon: {
    normal: 'step-chart',
    hover: 'step-chart',
    selected: 'step-chart'
  },
  url: (_urlParams, _urlQueries) => {
    return linkTo(routeDeployments)
  },
  menu: Menu
}
