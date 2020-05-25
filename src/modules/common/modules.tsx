import { ModuleName, linkTo, ModuleInfo } from 'framework'
import { CommonProject, CommonUserProfile, CommonSettings } from './routes'
import { Menu, MenuUserProfile } from './menu'
import i18n from './modules.i18n'
import { Icon } from '@wings-software/uikit'

export const CommonProjectModule: ModuleInfo = {
  module: ModuleName.COMMON,
  title: i18n.project,
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

export const CommonSettingsModule: ModuleInfo = {
  module: ModuleName.COMMON,
  title: i18n.settings,
  icon: {
    normal: 'layers',
    hover: 'layers',
    selected: 'layers'
  },
  position: 'BOTTOM',
  route: CommonSettings,
  url: (_urlParams, _urlQueries) => {
    return linkTo(CommonSettings)
  },
  menu: MenuUserProfile
}

export const CommonUserProfileModule: ModuleInfo = {
  module: ModuleName.COMMON,
  title: i18n.userProfile,
  icon: {
    normal: 'person',
    hover: 'person',
    selected: 'person'
  },
  position: 'BOTTOM',
  route: CommonUserProfile,
  url: (_urlParams, _urlQueries) => {
    return linkTo(CommonUserProfile)
  },
  menu: MenuUserProfile
}
