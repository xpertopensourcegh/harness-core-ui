import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Menu } from '@blueprintjs/core'
import { Layout, Color, Text, Icon } from '@wings-software/uikit'
import { Project, useDeleteProject } from 'services/cd-ng'
import { routeCDDashboard } from 'modules/cd/routes'
import { routeCVDataSources } from 'modules/cv/routes'
import { ModuleName, useAppStoreWriter, useAppStoreReader } from 'framework/exports'
import { useToaster } from 'modules/common/components/Toaster/useToaster'
import { useConfirmationDialog } from 'modules/common/modals/ConfirmDialog/useConfirmationDialog'
import i18n from './ContextMenu.i18n'

interface ContextMenuProps {
  project: Project
  reloadProjects?: () => Promise<unknown>
  editProject?: (project: Project) => void
  collaborators?: (project: Project) => void
}

const ContextMenu: React.FC<ContextMenuProps> = props => {
  const { accountId } = useParams()
  const history = useHistory()
  const { project, reloadProjects, editProject, collaborators } = props
  const { mutate: deleteProject } = useDeleteProject({
    queryParams: { accountIdentifier: accountId, orgIdentifier: project.orgIdentifier || '' }
  })
  const { showSuccess, showError } = useToaster()

  const { projects } = useAppStoreReader()
  const updateAppStore = useAppStoreWriter()

  const onDeleted = (): void => {
    const index = projects.findIndex(p => p.identifier === project.identifier)
    projects.splice(index, 1)
    updateAppStore({ projects: ([] as Project[]).concat(projects) })
  }

  const { openDialog } = useConfirmationDialog({
    contentText: i18n.confirmDelete(project.name || ''),
    titleText: i18n.confirmDeleteTitle,
    confirmButtonText: i18n.delete,
    cancelButtonText: i18n.cancel,
    onCloseDialog: async (isConfirmed: boolean) => {
      if (isConfirmed) {
        try {
          const deleted = await deleteProject(project.identifier || '', {
            headers: { 'content-type': 'application/json' }
          })
          if (deleted) showSuccess(i18n.successMessage(project.name || ''))
          onDeleted?.()
          reloadProjects?.()
        } catch (err) {
          showError(err)
        }
      }
    }
  })

  const handleDelete = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    event.stopPropagation()
    if (!project?.identifier) return
    openDialog()
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
