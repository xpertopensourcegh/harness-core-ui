import React from 'react'
import { useHistory } from 'react-router-dom'
import { Menu } from '@blueprintjs/core'
import { Layout, Color, Text, Icon } from '@wings-software/uikit'
import type { Project } from 'services/cd-ng'
import { routeCDDashboard } from 'modules/cd/routes'
import { routeCVDataSources } from 'modules/cv/routes'
import { ModuleName } from 'framework/exports'
import i18n from './ContextMenu.i18n'

interface ContextMenuProps {
  project: Project
  reloadProjects?: () => Promise<unknown>
  editProject?: (project: Project) => void
  collaborators?: (project: Project) => void
  setMenuOpen?: (value: React.SetStateAction<boolean>) => void
  openDialog?: () => void
}

const ContextMenu: React.FC<ContextMenuProps> = props => {
  const history = useHistory()
  const { project, editProject, collaborators, setMenuOpen, openDialog } = props
  const handleDelete = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    event.stopPropagation()
    setMenuOpen?.(false)
    if (!project?.identifier) return
    openDialog?.()
  }

  const handleEdit = (): void => {
    if (!project) return
    editProject?.(project)
  }

  const handleCollaborate = (): void => {
    if (!project) return
    collaborators?.(project)
  }

  const handleCD = (): void => {
    history.push(
      routeCDDashboard.url({
        orgIdentifier: project?.orgIdentifier as string,
        projectIdentifier: project?.identifier as string
      })
    )
  }

  const handleCV = (): void => {
    history.push(
      routeCVDataSources.url({
        projectIdentifier: project.identifier || '',
        orgIdentifier: project.orgIdentifier || ''
      })
    )
  }

  return (
    <Menu style={{ minWidth: 'unset' }}>
      {project.modules?.includes(ModuleName.CD) ? (
        <Menu.Item
          text={
            <Layout.Horizontal spacing="xsmall">
              <Icon name="cd-hover" />
              <Text color={Color.WHITE}>{i18n.gotoCD}</Text>
            </Layout.Horizontal>
          }
          onClick={handleCD}
        />
      ) : null}
      {project.modules?.includes(ModuleName.CV) ? (
        <Menu.Item
          text={
            <Layout.Horizontal spacing="xsmall">
              <Icon name="nav-cv-hover" />
              <Text color={Color.WHITE}>{i18n.gotoCV}</Text>
            </Layout.Horizontal>
          }
          onClick={handleCV}
        />
      ) : null}
      <Menu.Item icon="edit" text={i18n.edit} onClick={handleEdit} />
      <Menu.Item icon="new-person" text={i18n.invite} onClick={handleCollaborate} />
      <Menu.Divider />
      <Menu.Item icon="trash" text={i18n.delete} onClick={handleDelete} />
    </Menu>
  )
}

export default ContextMenu
