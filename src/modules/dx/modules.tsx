import { ModuleName, linkTo, ModuleInfo } from 'framework'
import { DXDashboard } from './routes'
import { Menu } from './menu/Menu'
import i18n from './modules.i18n'

export const DXDashboardModule: ModuleInfo = {
  module: ModuleName.DX,
  title: i18n.dashboard,
  icon: {
    normal: 'harness',
    hover: 'harness',
    selected: 'harness'
  },
  route: DXDashboard,
  url: (_urlParams, _urlQueries) => {
    return linkTo(DXDashboard)
  },
  menu: Menu
}
