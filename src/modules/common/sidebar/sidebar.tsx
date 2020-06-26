import { linkTo, SidebarEntry, SidebarIdentifier } from 'framework/exports'
import { routeProject, routeUserProfile, routeAdmin } from '../routes'
import { MenuProjects } from './MenuProjects'
import { MenuAccount } from './MenuAccount'
import i18n from './sidebar.i18n'
import { MenuUserProfile } from './MenuUserProfile'

export const Projects: SidebarEntry = {
  sidebarId: SidebarIdentifier.PROJECTS,
  position: 'BOTTOM',
  title: i18n.project,
  icon: {
    normal: 'nav-project',
    hover: 'nav-project-hover',
    selected: 'nav-project-selected'
  },
  url: _routeParams => {
    return linkTo(routeProject)
  },
  sidebarMenu: MenuProjects
}

export const Account: SidebarEntry = {
  sidebarId: SidebarIdentifier.ACCOUNT,
  title: i18n.settings,
  icon: {
    normal: 'nav-settings',
    hover: 'nav-settings-hover',
    selected: 'nav-settings-selected'
  },
  position: 'BOTTOM',
  url: _routeParams => {
    return linkTo(routeAdmin)
  },
  sidebarMenu: MenuAccount
}

export const UserProfile: SidebarEntry = {
  sidebarId: SidebarIdentifier.USER_PROFILE,
  title: i18n.userProfile,
  icon: {
    normal: 'nav-user-profile',
    hover: 'nav-user-profile-hover',
    selected: 'nav-user-profile-selected'
  },
  position: 'BOTTOM',
  url: _routeParams => {
    return linkTo(routeUserProfile)
  },
  sidebarMenu: MenuUserProfile
}
