import React from 'react'
import { ModuleName, linkTo, ModuleEntry } from 'framework'
import { CommonProject } from './routes'

export const CommonProjectModule: ModuleEntry = {
  module: ModuleName.COMMON,
  route: CommonProject,
  icon: {
    normal: 'cube',
    hover: 'cube',
    selected: 'cube'
  },
  href: (_urlParams, _urlQueries) => {
    return linkTo(CommonProject)
  },
  menu: <div>Sub menu</div>
}
