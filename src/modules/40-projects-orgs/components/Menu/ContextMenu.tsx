import React from 'react'
import { useHistory } from 'react-router-dom'
import { Menu } from '@blueprintjs/core'
import { Layout, Color, Text, Icon } from '@wings-software/uikit'
import type { Project } from 'services/cd-ng'
import routes from '@common/RouteDefinitions'
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

  const handleEdit = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    event.stopPropagation()
    setMenuOpen?.(false)
    if (!project) return
    editProject?.(project)
  }

  const handleCollaborate = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    event.stopPropagation()
    setMenuOpen?.(false)
    if (!project) return
    collaborators?.(project)
  }

  const handleCD = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    event.stopPropagation()
    setMenuOpen?.(false)
    history.push(
      routes.toCDDashboard({
        orgIdentifier: project?.orgIdentifier as string,
        projectIdentifier: project?.identifier as string,
        accountId: project?.accountIdentifier as string
      })
    )
  }

  const handleCV = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    event.stopPropagation()
    setMenuOpen?.(false)
    history.push(
      routes.toCVDataSources({
        projectIdentifier: project.identifier || '',
        orgIdentifier: project.orgIdentifier || '',
        accountId: project?.accountIdentifier as string
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
              <Icon name="cv-main" />
              <Text color={Color.WHITE}>{i18n.gotoCV}</Text>
            </Layout.Horizontal>
          }
          onClick={handleCV}
        />
      ) : null}
      <Menu.Item icon="edit" text={i18n.edit} onClick={handleEdit} />
      <Menu.Item icon="new-person" text={i18n.invite} onClick={handleCollaborate} />

      {openDialog ? (
        <>
          <Menu.Divider />
          <Menu.Item icon="trash" text={i18n.delete} onClick={handleDelete} />
        </>
      ) : null}
    </Menu>
  )
}

export default ContextMenu
