import React from 'react'
import { ModuleName, linkTo, ModuleInfo } from 'framework'
import { DXDashboard } from './routes'

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
  menu: <div>DX Sub menu</div>
}
