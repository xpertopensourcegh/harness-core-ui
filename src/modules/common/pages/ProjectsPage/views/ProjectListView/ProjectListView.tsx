import React, { useState, useMemo } from 'react'
import ReactTimeago from 'react-timeago'
import { Text, Layout, Color, Icon, Button, Popover } from '@wings-software/uikit'
import type { CellProps, Renderer, Column } from 'react-table'
import { Menu, Classes, Position } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'
import { Project, useDeleteProject, NGPageResponseProject } from 'services/cd-ng'
import Table from 'modules/common/components/Table/Table'
import { useConfirmationDialog } from 'modules/common/exports'
import { useToaster } from 'modules/common/components/Toaster/useToaster'

import TagsPopover from 'modules/common/components/TagsPopover/TagsPopover'
import { useAppStoreReader } from 'framework/exports'
import i18n from './ProjectListView.i18n'
import css from './ProjectListView.module.scss'

interface ProjectListViewProps {
  data?: NGPageResponseProject
  reload?: () => Promise<void>
  editProject?: (project: Project) => void
  gotoPage: (pageNumber: number) => void
  collaborators?: (project: Project) => void
}

type CustomColumn<T extends object> = Column<T> & {
  refetchProjects?: () => Promise<void>
  editProject?: (project: Project) => void
  collaborators?: (project: Project) => void
}

const RenderColumnProject: Renderer<CellProps<Project>> = ({ row }) => {
  const data = row.original
  return (
    <Layout.Horizontal spacing="small">
      <div className={css.colorbox} style={{ backgroundColor: `${data.color}` }} />
      <div>
        <Layout.Horizontal spacing="small">
          <Text color={Color.BLACK}>{data.name}</Text>
          {data.tags?.length ? <TagsPopover tags={data.tags} /> : null}
        </Layout.Horizontal>
        <Text color={Color.GREY_400}>{data.description}</Text>
      </div>
    </Layout.Horizontal>
  )
}
const RenderColumnOrganisation: Renderer<CellProps<Project>> = ({ row }) => {
  const data = row.original
  const { organisationsMap } = useAppStoreReader()
  return <Text color={Color.BLACK}>{organisationsMap.get(data.orgIdentifier || '')?.name}</Text>
}

const RenderColumnModules: Renderer<CellProps<Project>> = ({ row }) => {
  const data = row.original
  return (
    <Layout.Horizontal spacing="medium">
      {data.modules?.includes('CD') ? <Icon name="cd-hover" size={20}></Icon> : null}
      {data.modules?.includes('CV') ? <Icon name="nav-cv-hover" size={20}></Icon> : null}
    </Layout.Horizontal>
  )
}

const RenderColumnActivity: Renderer<CellProps<Project>> = ({ row }) => {
  const data = row.original
  return (
    <Layout.Horizontal spacing="small">
      <Icon name="activity" />
      {data.lastModifiedAt ? <ReactTimeago date={data.lastModifiedAt} /> : null}
    </Layout.Horizontal>
  )
}
const RenderColumnAdmin: Renderer<CellProps<Project>> = () => {
  return <Icon name="main-user-groups" size={20} />
}

const RenderColumnMenu: Renderer<CellProps<Project>> = ({ row, column }) => {
  const data = row.original
  const { accountId } = useParams()
  const [menuOpen, setMenuOpen] = useState(false)
  const { showSuccess, showError } = useToaster()
  const { mutate: deleteProject } = useDeleteProject({
    queryParams: { accountIdentifier: accountId, orgIdentifier: data.orgIdentifier || '' }
  })

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

  const handleDelete = (): void => {
    if (!data?.identifier) return
    openDialog()
  }
  const handleEdit = (): void => {
    if (!data) return
    ;(column as any).editProject?.(data)
  }

  const handleCollaborate = (): void => {
    if (!data) return
    ;(column as any).collaborators?.(data)
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
          icon="more"
          onClick={e => {
            e.stopPropagation()
            setMenuOpen(true)
          }}
        />
        <Menu style={{ minWidth: 'unset' }}>
          <Menu.Item icon="edit" text="Edit" onClick={handleEdit} />
          <Menu.Item icon="new-person" text="Invite Collaborators" onClick={handleCollaborate} />
          <Menu.Divider />
          <Menu.Item icon="trash" text="Delete" onClick={handleDelete} />
        </Menu>
      </Popover>
    </Layout.Horizontal>
  )
}

const ProjectListView: React.FC<ProjectListViewProps> = props => {
  const { data, reload, editProject, gotoPage, collaborators } = props
  const columns: CustomColumn<Project>[] = useMemo(
    () => [
      {
        Header: i18n.project.toUpperCase(),
        accessor: 'name',
        width: '25%',
        Cell: RenderColumnProject
      },
      {
        Header: i18n.organisation.toUpperCase(),
        accessor: 'orgIdentifier',
        width: '15%',
        Cell: RenderColumnOrganisation
      },
      {
        Header: i18n.modules.toUpperCase(),
        accessor: 'modules',
        width: '20%',
        Cell: RenderColumnModules,
        disableSortBy: true
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
        width: '10%',
        Cell: RenderColumnAdmin,
        disableSortBy: true
      },
      {
        Header: i18n.collaborators.toUpperCase(),
        accessor: 'accountIdentifier',
        width: '10%',
        Cell: RenderColumnAdmin,
        disableSortBy: true
      },
      {
        Header: '',
        accessor: 'tags',
        width: '5%',
        Cell: RenderColumnMenu,
        refetchProjects: reload,
        editProject: editProject,
        collaborators: collaborators,
        disableSortBy: true
      }
    ],
    [reload, editProject, collaborators]
  )
  return (
    <Table<Project>
      className={css.table}
      columns={columns}
      data={data?.content || []}
      pagination={{
        itemCount: data?.itemCount || 0,
        pageSize: data?.pageSize || 10,
        pageCount: data?.pageCount || -1,
        pageIndex: data?.pageIndex || 0,
        gotoPage
      }}
    />
  )
}

export default ProjectListView
