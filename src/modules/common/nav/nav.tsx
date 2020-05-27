import { linkTo, NavEntry, NavIdentifier } from 'framework'
import { routeProject, routeUserProfile, routeSettings } from '../routes'
import { MenuDeployments } from './MenuDeployments'
import { MenuSettings } from './MenuSettings'
import i18n from '../common.i18n'

export const navProjects: NavEntry = {
  navId: NavIdentifier.PROJECTS,
  title: i18n.project,
  icon: {
    normal: 'cube',
    hover: 'cube',
    selected: 'cube'
  },
  url: _routeParams => {
    return linkTo(routeProject)
  },
  menu: MenuDeployments
}

export const navSettings: NavEntry = {
  navId: NavIdentifier.SETTINGS,
  title: i18n.settings,
  icon: {
    normal: 'layers',
    hover: 'layers',
    selected: 'layers'
  },
  position: 'BOTTOM',
  url: _routeParams => {
    return linkTo(routeSettings)
  },
  menu: MenuSettings
}

export const navUserProfile: NavEntry = {
  navId: NavIdentifier.USER_PROFILE,
  title: i18n.userProfile,
  icon: {
    normal: 'person',
    hover: 'person',
    selected: 'person'
  },
  position: 'BOTTOM',
  url: _routeParams => {
    return linkTo(routeUserProfile)
  }
  // no menu, CommonUserProfile route also uses PageLayout.NoMenuLayout
}
