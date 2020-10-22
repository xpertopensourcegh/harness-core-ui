import { SidebarEntry, SidebarIdentifier } from 'framework/exports'
import { routeProjects } from '../routes'
import { MenuProjects } from './MenuProjects'
import i18n from './sidebar.i18n'

export const Projects: SidebarEntry = {
  sidebarId: SidebarIdentifier.PROJECTS,
  position: 'TOP',
  title: i18n.project,
  icon: {
    normal: 'nav-project',
    hover: 'nav-project-hover',
    selected: 'nav-project-selected'
  },
  url: routeProjects.url,
  sidebarMenu: MenuProjects
}
