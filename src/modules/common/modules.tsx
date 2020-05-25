import React from 'react'
import { ModuleName, linkTo, ModuleInfo } from 'framework'
import { CommonProject } from './routes'

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
  menu: <div>Sub menu</div>
}
