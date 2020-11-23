import React, { useState, useMemo, useEffect } from 'react'
import ReactTimeago from 'react-timeago'
import { Text, Layout, Color, Icon, Button, Popover } from '@wings-software/uikit'
import type { CellProps, Renderer, Column } from 'react-table'
import { Classes, Position } from '@blueprintjs/core'
import { useHistory, useParams } from 'react-router-dom'
import { Project, useGetProjectList, useDeleteProject } from 'services/cd-ng'
import Table from '@common/components/Table/Table'

import TagsPopover from '@common/components/TagsPopover/TagsPopover'
import { useAppStoreReader, useAppStoreWriter } from 'framework/exports'
import { Page } from '@common/components/Page/Page'
import { useToaster } from '@common/components/Toaster/useToaster'
import { useConfirmationDialog } from '@common/modals/ConfirmDialog/useConfirmationDialog'
import ContextMenu from '@projects-orgs/components/Menu/ContextMenu'
import { routeProjectDetails } from 'navigation/projects/routes'
import i18n from './ProjectListView.i18n'
import css from './ProjectListView.module.scss'

interface ProjectListViewProps {
  showEditProject?: (project: Project) => void
  collaborators?: (project: Project) => void
  searchParameter?: string
  orgFilterId?: string
  module?: Required<Project>['modules'][number]
  reloadPage?: ((value: React.SetStateAction<boolean>) => void) | undefined
  openProjectModal?: (project?: Project | undefined) => void
  deselectModule?: boolean
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
      <Layout.Vertical padding={{ left: 'small' }} className={css.verticalCenter}>
        <Layout.Horizontal spacing="small">
          <Text color={Color.BLACK} lineClamp={1} className={css.project}>
            {data.name}
          </Text>
          {data.tags ? <TagsPopover tags={data.tags} /> : null}
        </Layout.Horizontal>
        {data.description ? (
          <Text color={Color.GREY_400} lineClamp={1} className={css.project}>
            {data.description}
          </Text>
        ) : null}
      </Layout.Vertical>
    </Layout.Horizontal>
  )
}
const RenderColumnOrganisation: Renderer<CellProps<Project>> = ({ row }) => {
  const data = row.original
  const { organisationsMap } = useAppStoreReader()
  return (
    <Text color={Color.BLACK} lineClamp={1} className={css.org}>
      {organisationsMap.get(data.orgIdentifier || /* istanbul ignore next */ '')?.name}
    </Text>
  )
}

const RenderColumnModules: Renderer<CellProps<Project>> = ({ row }) => {
  const data = row.original
  return (
    <Layout.Horizontal spacing="medium">
      {data.modules?.includes('CD') ? <Icon name="cd-hover" size={20}></Icon> : null}
      {data.modules?.includes('CV') ? <Icon name="cv-main" size={20}></Icon> : null}
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
  const { mutate: deleteProject } = useDeleteProject({
    queryParams: { accountIdentifier: accountId, orgIdentifier: data.orgIdentifier || /* istanbul ignore next */ '' }
  })
  const { showSuccess, showError } = useToaster()

  const { projects } = useAppStoreReader()
  const updateAppStore = useAppStoreWriter()
  const onDeleted = (): void => {
    const index = projects.findIndex(p => p.identifier === data.identifier)
    projects.splice(index, 1)
    updateAppStore({ projects: ([] as Project[]).concat(projects) })
  }
  const { openDialog } = useConfirmationDialog({
    contentText: i18n.confirmDelete(data.name || /* istanbul ignore next */ ''),
    titleText: i18n.confirmDeleteTitle,
    confirmButtonText: i18n.delete,
    cancelButtonText: i18n.cancel,
    onCloseDialog: async (isConfirmed: boolean) => {
      if (isConfirmed) {
        try {
          const deleted = await deleteProject(data.identifier || /* istanbul ignore next */ '', {
            headers: { 'content-type': 'application/json' }
          })
          if (deleted) showSuccess(i18n.successMessage(data.name || /* istanbul ignore next */ ''))
          onDeleted()
          ;(column as any).refetchProjects()
        } catch (err) {
          showError(err)
        }
      }
    }
  })

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
          setMenuOpen={setMenuOpen}
          openDialog={openDialog}
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
    openProjectModal,
    deselectModule
  } = props
  const { accountId } = useParams()
  const [page, setPage] = useState(0)
  const history = useHistory()
  const { data, loading, refetch } = useGetProjectList({
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: orgFilterId == 'ALL' ? undefined : orgFilterId,
      moduleType: module,
      searchTerm: searchParameter,
      hasModule: deselectModule ? false : true,
      pageIndex: page,
      pageSize: 10
    },
    debounce: 300
  })

  if (reloadPage) {
    refetch()
    reloadPage(false)
  }

  useEffect(() => {
    setPage(0)
  }, [searchParameter, orgFilterId])

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
        accessor: 'accountIdentifier',
        width: '10%',
        Cell: RenderColumnAdmin,
        disableSortBy: true
      },
      {
        Header: i18n.collaborators.toUpperCase(),
        accessor: 'identifier',
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
              onClick: () => openProjectModal?.()
            }
          : {
              when: () => !data?.data?.content?.length,
              icon: 'nav-project',
              message: i18n.noProject
            }
      }
      className={css.pageContainer}
    >
      <Table<Project>
        className={css.table}
        columns={columns}
        data={data?.data?.content || []}
        onRowClick={project => {
          history.push(
            routeProjectDetails.url({
              projectIdentifier: project.identifier,
              orgIdentifier: project.orgIdentifier || ''
            })
          )
        }}
        pagination={{
          itemCount: data?.data?.totalItems || 0,
          pageSize: data?.data?.pageSize || 10,
          pageCount: data?.data?.totalPages || 0,
          pageIndex: data?.data?.pageIndex || 0,
          gotoPage: (pageNumber: number) => setPage(pageNumber)
        }}
      />
    </Page.Body>
  )
}

export default ProjectListView
