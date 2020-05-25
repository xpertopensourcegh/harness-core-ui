import { ModuleName, linkTo, NavEntry } from 'framework'
import { CVHome } from './routes'
import { Menu } from './menu/Menu'
import i18n from './modules.i18n'

export const CVHomeModule: NavEntry = {
  module: ModuleName.CV,
  title: i18n.title,
  icon: {
    normal: 'cloud',
    hover: 'cloud',
    selected: 'cloud'
  },
  route: CVHome,
  url: (_urlParams, _urlQueries) => {
    return linkTo(CVHome)
  },
  menu: Menu
}
