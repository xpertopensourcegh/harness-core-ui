import React, { useState, useMemo } from 'react'
import { Text, Layout, Color, Icon, Button, Popover } from '@wings-software/uikit'
import type { CellProps, Renderer, Column } from 'react-table'
import { Menu, Classes, Position } from '@blueprintjs/core'
import { ProjectDTO, useDeleteProject } from 'services/cd-ng'
import Table from 'modules/common/components/Table/Table'
import { useConfirmationDialog } from 'modules/common/exports'
import { useToaster } from 'modules/common/components/Toaster/useToaster'

import i18n from './ProjectView.i18n'
import css from './ProjectListView.module.scss'

interface ProjectListViewProps {
  data?: ProjectDTO[]
  reload?: () => Promise<void>
  editProject?: (project: ProjectDTO) => void
}

type CustomColumn<T extends object> = Column<T> & {
  refetchProjects?: () => Promise<void>
  editProject?: (project: ProjectDTO) => void
}

const RenderColumnProject: Renderer<CellProps<ProjectDTO>> = ({ row }) => {
  const data = row.original
  return (
    <Layout.Horizontal spacing="medium">
      <div className={css.colorbox} style={{ backgroundColor: `${data.color}` }} />
      <div>
        <Text color={Color.BLACK}>{data.name}</Text>
        <Text color={Color.GREY_400}>{data.description}</Text>
      </div>
    </Layout.Horizontal>
  )
}
const RenderColumnOrganisation: Renderer<CellProps<ProjectDTO>> = ({ row }) => {
  const data = row.original
  return <Text color={Color.BLACK}>{data.organizationName}</Text>
}

const RenderColumnModules: Renderer<CellProps<ProjectDTO>> = ({ row }) => {
  const data = row.original
  return (
    <Layout.Horizontal spacing="medium">
      {data.modules?.includes('CD') ? <Icon name="cd-hover" size={20}></Icon> : null}
      {data.modules?.includes('CV') ? <Icon name="nav-cv-hover" size={20}></Icon> : null}
    </Layout.Horizontal>
  )
}

const RenderColumnActivity: Renderer<CellProps<ProjectDTO>> = () => {
  return (
    <Layout.Horizontal spacing="small">
      <Icon name="activity" />
      <Text>{i18n.time}</Text>
    </Layout.Horizontal>
  )
}
const RenderColumnAdmin: Renderer<CellProps<ProjectDTO>> = () => {
  return <Icon name="main-user-groups" size={20} />
}

const RenderColumnMenu: Renderer<CellProps<ProjectDTO>> = ({ row, column }) => {
  const data = row.original
  const [menuOpen, setMenuOpen] = useState(false)
  const { showSuccess, showError } = useToaster()

  const { mutate: deleteProject } = useDeleteProject({ orgIdentifier: data.orgIdentifier || '' })

  const { openDialog } = useConfirmationDialog({
    contentText: i18n.confirmDelete(data.name || ''),
    titleText: i18n.confirmDeleteTitle,
    confirmButtonText: i18n.deleteButton,
    cancelButtonText: i18n.cancelButton,
    onCloseDialog: async (isConfirmed: boolean) => {
      if (isConfirmed) {
        try {
          const deleted = await deleteProject(data.identifier || '', {
            headers: { 'content-type': 'application/json' }
          })
          if (deleted) showSuccess(`Project ${data.name} deleted`)
          ;(column as any).refetchProjects?.()
        } catch (err) {
          showError(err)
        }
      }
    }
  })

  const handleDelete = async (): Promise<void> => {
    if (!data?.id) return
    openDialog()
  }
  const handleEdit = (): void => {
    if (!data) return
    ;(column as any).editProject?.(data)
  }

  return (
    <Layout.Horizontal className={css.layout}>
      <Popover
        isOpen={menuOpen}
        onInteraction={nextOpenState => {
          setMenuOpen(nextOpenState)
        }}
        className={Classes.DARK}
        position={Position.BOTTOM_RIGHT}
      >
        <Button
          minimal
          icon="menu"
          onClick={e => {
            e.stopPropagation()
            setMenuOpen(true)
          }}
        />
        <Menu style={{ minWidth: 'unset' }}>
          <Menu.Item icon="edit" text="Edit" onClick={handleEdit} />
          <Menu.Item icon="new-person" text="Invite Collaborators" />
          <Menu.Divider />
          <Menu.Item icon="trash" text="Delete" onClick={handleDelete} />
        </Menu>
      </Popover>
    </Layout.Horizontal>
  )
}

const ProjectListView: React.FC<ProjectListViewProps> = props => {
  const { data, reload, editProject } = props
  const columns: CustomColumn<ProjectDTO>[] = useMemo(
    () => [
      {
        Header: i18n.project.toUpperCase(),
        accessor: 'name',
        width: '25%',
        Cell: RenderColumnProject
      },
      {
        Header: i18n.organisation.toUpperCase(),
        accessor: 'organizationName',
        width: '20%',
        Cell: RenderColumnOrganisation
      },
      {
        Header: i18n.modules.toUpperCase(),
        accessor: 'modules',
        width: '20%',
        Cell: RenderColumnModules
      },
      {
        Header: i18n.lastActivity.toUpperCase(),
        accessor: 'lastModifiedAt',
        width: '15%',
        Cell: RenderColumnActivity
      },
      {
        Header: i18n.admin.toUpperCase(),
        accessor: 'owners',
        width: '5%',
        Cell: RenderColumnAdmin
      },
      {
        Header: i18n.collaborators.toUpperCase(),
        accessor: 'orgIdentifier',
        width: '10%',
        Cell: RenderColumnAdmin
      },
      {
        Header: '',
        accessor: 'tags',
        width: '5%',
        Cell: RenderColumnMenu,
        refetchProjects: reload,
        editProject: editProject
      }
    ],
    [reload, editProject]
  )
  return <Table<ProjectDTO> className={css.table} columns={columns} data={data || []} />
}

export default ProjectListView
