import { ModuleName, linkTo, ModuleInfo } from 'framework'
import { DXDashboard } from './routes'
import { Menu } from './menu/Menu'

export const DXDashboardModule: ModuleInfo = {
  module: ModuleName.DX,
  route: DXDashboard,
  icon: {
    normal: 'harness',
    hover: 'harness',
    selected: 'harness'
  },
  url: (_urlParams, _urlQueries) => {
    return linkTo(DXDashboard)
  },
  menu: Menu
}
