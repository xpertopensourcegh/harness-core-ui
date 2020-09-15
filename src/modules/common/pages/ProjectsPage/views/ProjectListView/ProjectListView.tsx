import React, { useState, useMemo } from 'react'
import ReactTimeago from 'react-timeago'
import { Text, Layout, Color, Icon, Button, Popover } from '@wings-software/uikit'
import type { CellProps, Renderer, Column } from 'react-table'
import { Classes, Position } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'
import { Project, useGetProjectList } from 'services/cd-ng'
import Table from 'modules/common/components/Table/Table'

import TagsPopover from 'modules/common/components/TagsPopover/TagsPopover'
import { useAppStoreReader } from 'framework/exports'
import { Page } from 'modules/common/components/Page/Page'
import i18n from './ProjectListView.i18n'
import ContextMenu from '../Menu/ContextMenu'
import css from './ProjectListView.module.scss'

interface ProjectListViewProps {
  showEditProject?: (project: Project) => void
  collaborators?: (project: Project) => void
  searchParameter?: string
  orgFilterId?: string
  module?: Required<Project>['modules'][number]
  reloadPage?: ((value: React.SetStateAction<boolean>) => void) | undefined
  onRowClick?: ((data: Project) => void) | undefined
  openProjectModal?: (project?: Project | undefined) => void
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
  const [menuOpen, setMenuOpen] = useState(false)

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
        <ContextMenu
          project={data}
          reloadProjects={(column as any).refetchProjects}
          editProject={(column as any).editProject}
          collaborators={(column as any).collaborators}
        />
      </Popover>
    </Layout.Horizontal>
  )
}

const ProjectListView: React.FC<ProjectListViewProps> = props => {
  const {
    showEditProject,
    collaborators,
    searchParameter,
    orgFilterId,
    module,
    reloadPage,
    onRowClick,
    openProjectModal
  } = props
  const { accountId } = useParams()
  const [page, setPage] = useState(0)

  const { data, loading, refetch } = useGetProjectList({
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: orgFilterId == 'ALL' ? undefined : orgFilterId,
      moduleType: module,
      searchTerm: searchParameter,
      page: page,
      size: 10
    },
    debounce: 300
  })

  if (reloadPage) {
    refetch()
    reloadPage(false)
  }

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
        refetchProjects: refetch,
        editProject: showEditProject,
        collaborators: collaborators,
        disableSortBy: true
      }
    ],
    [refetch, showEditProject, collaborators]
  )
  return (
    <Page.Body
      loading={loading}
      retryOnError={() => refetch()}
      noData={
        !searchParameter && openProjectModal
          ? {
              when: () => !data?.data?.content?.length,
              icon: 'nav-project',
              message: i18n.aboutProject,
              buttonText: i18n.addProject,
              onClick: () => openProjectModal?.(),
              className: css.pageContainer
            }
          : {
              when: () => !data?.data?.content?.length,
              icon: 'nav-project',
              message: i18n.noProject
            }
      }
    >
      <Table<Project>
        className={css.table}
        columns={columns}
        data={data?.data?.content || []}
        onRowClick={onRowClick}
        pagination={{
          itemCount: data?.data?.itemCount || 0,
          pageSize: data?.data?.pageSize || 10,
          pageCount: data?.data?.pageCount || 0,
          pageIndex: data?.data?.pageIndex || 0,
          gotoPage: (pageNumber: number) => setPage(pageNumber)
        }}
      />
    </Page.Body>
  )
}

export default ProjectListView
