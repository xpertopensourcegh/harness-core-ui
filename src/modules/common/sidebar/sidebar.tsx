import { linkTo, SidebarEntry, SidebarIdentifier } from 'framework/exports'
import { routeProject, routeUserProfile, routeSettings } from '../routes'
import { MenuProjects } from './MenuProjects'
import { MenuSettings } from './MenuSettings'
import i18n from './sidebar.i18n'
import { MenuUserProfile } from './MenuUserProfile'

export const Projects: SidebarEntry = {
  sidebarId: SidebarIdentifier.PROJECTS,
  title: i18n.project,
  icon: {
    normal: 'cube',
    hover: 'cube',
    selected: 'cube'
  },
  url: _routeParams => {
    return linkTo(routeProject)
  },
  sidebarMenu: MenuProjects
}

export const Settings: SidebarEntry = {
  sidebarId: SidebarIdentifier.SETTINGS,
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
  sidebarMenu: MenuSettings
}

export const UserProfile: SidebarEntry = {
  sidebarId: SidebarIdentifier.USER_PROFILE,
  title: i18n.userProfile,
  icon: {
    normal: 'person',
    hover: 'person',
    selected: 'person'
  },
  position: 'BOTTOM',
  url: _routeParams => {
    return linkTo(routeUserProfile)
  },
  sidebarMenu: MenuUserProfile
}
