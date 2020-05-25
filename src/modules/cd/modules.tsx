import { ModuleName, linkTo, NavEntry } from 'framework'
import { CDDeployments } from './routes'
import { Menu } from './menu/Menu'
import i18n from './modules.i18n'

export const DeploymentsModule: NavEntry = {
  module: ModuleName.COMMON,
  title: i18n.deployments,
  route: CDDeployments,
  icon: {
    normal: 'step-chart',
    hover: 'step-chart',
    selected: 'step-chart'
  },
  url: (_urlParams, _urlQueries) => {
    return linkTo(CDDeployments)
  },
  menu: Menu
}
