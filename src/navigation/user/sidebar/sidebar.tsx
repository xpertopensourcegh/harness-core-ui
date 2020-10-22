import { SidebarEntry, SidebarIdentifier } from 'framework/exports'
import { routeUserProfile } from '../routes'
import i18n from './sidebar.i18n'
import { MenuUserProfile } from './MenuUserProfile'

export const UserProfile: SidebarEntry = {
  sidebarId: SidebarIdentifier.USER_PROFILE,
  title: i18n.userProfile,
  icon: {
    normal: 'nav-user-profile',
    hover: 'nav-user-profile-hover',
    selected: 'nav-user-profile-selected'
  },
  position: 'BOTTOM',
  url: routeUserProfile.url,
  sidebarMenu: MenuUserProfile
}
