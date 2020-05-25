import React from 'react'
import { ModuleName, linkTo, ModuleInfo } from 'framework'
import { CVHome } from './routes'

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
  menu: <div>Sub menu</div>
}
