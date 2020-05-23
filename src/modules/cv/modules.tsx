import React from 'react'
import { ModuleName, linkTo, ModuleEntry } from 'framework'
import { CVHome } from './routes'

export const CVHomeModule: ModuleEntry = {
  module: ModuleName.CV,
  route: CVHome,
  icon: {
    normal: 'harness',
    hover: 'harness',
    selected: 'harness'
  },
  href: (_urlParams, _urlQueries) => {
    return linkTo(CVHome)
  },
  menu: <div>Sub menu</div>
}
