import { ModuleName, linkTo, ModuleInfo } from 'framework'
import { CommonProject } from './routes'
import { Menu } from './menu/Menu'

export const CommonProjectModule: ModuleInfo = {
  module: ModuleName.COMMON,
  route: CommonProject,
  icon: {
    normal: 'cube',
    hover: 'cube',
    selected: 'cube'
  },
  url: (_urlParams, _urlQueries) => {
    return linkTo(CommonProject)
  },
  menu: Menu
}
