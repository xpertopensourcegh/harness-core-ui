import React from 'react'
import { ModuleName, linkTo, ModuleEntry } from 'framework'
import { DXDashboard } from './routes'

export const DXDashboardModule: ModuleEntry = {
  module: ModuleName.DX,
  route: DXDashboard,
  icon: {
    normal: 'harness',
    hover: 'harness',
    selected: 'harness'
  },
  href: (_urlParams, _urlQueries) => {
    return linkTo(DXDashboard)
  },
  menu: <div>DX Sub menu</div>
}
