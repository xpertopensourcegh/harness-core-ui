import { ModuleName, linkTo, ModuleInfo } from 'framework'
import { CVHome } from './routes'
import { Menu } from './menu/Menu'

export const CVHomeModule: ModuleInfo = {
  module: ModuleName.CV,
  route: CVHome,
  icon: {
    normal: 'harness',
    hover: 'harness',
    selected: 'harness'
  },
  url: (_urlParams, _urlQueries) => {
    return linkTo(CVHome)
  },
  menu: Menu
}
