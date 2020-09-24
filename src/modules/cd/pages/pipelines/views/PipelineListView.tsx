import React from 'react'
import type { CellProps, Column, Renderer } from 'react-table'
import { Button, Color, Layout, Popover, Text, Icon, SparkChart } from '@wings-software/uikit'
import { Classes, Menu, Position } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'
import Table from 'modules/common/components/Table/Table'
import { CDPipelineSummaryResponseDTO, PageCDPipelineSummaryResponseDTO, useSoftDeletePipeline } from 'services/cd-ng'
import TagsPopover from 'modules/common/components/TagsPopover/TagsPopover'
import { useConfirmationDialog, useToaster } from 'modules/common/exports'
import i18n from '../CDPipelinesPage.i18n'
import css from '../CDPipelinesPage.module.scss'

interface PipelineListViewProps {
  data?: PageCDPipelineSummaryResponseDTO
  gotoPage: (pageNumber: number) => void
  goToPipelineDetail: (pipelineIdentifier?: string) => void
  runPipeline: (pipelineIdentifier?: string) => void
  goToPipelineStudio: (pipelineIdentifier?: string) => void
  refetchPipeline: () => void
}

// Todo: Remove this when BE updated
interface PipelineDTO extends CDPipelineSummaryResponseDTO {
  admin?: string
  collaborators?: string
  stages?: number
  activity?: string
  status?: string
  errors?: number
}

type CustomColumn<T extends object> = Column<T> & {
  runPipeline?: (pipelineIdentifier?: string) => void
  goToPipelineStudio?: (pipelineIdentifier?: string) => void
  refetchPipeline?: () => void
}

const RenderColumnMenu: Renderer<CellProps<PipelineDTO>> = ({ row, column }) => {
  const data = row.original
  const [menuOpen, setMenuOpen] = React.useState(false)
  const { showSuccess, showError } = useToaster()
  const { projectIdentifier, orgIdentifier, accountId } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()
  const { mutate: deletePipeline } = useSoftDeletePipeline({
    queryParams: { accountIdentifier: accountId, orgIdentifier, projectIdentifier }
  })

  const { openDialog: confirmDelete } = useConfirmationDialog({
    contentText: i18n.confirmDelete(data.name || ''),
    titleText: i18n.confirmDeleteTitle,
    confirmButtonText: i18n.deleteButton,
    cancelButtonText: i18n.cancel,
    onCloseDialog: async (isConfirmed: boolean) => {
      if (isConfirmed) {
        try {
          const deleted = await deletePipeline(data.identifier || '', {
            headers: { 'content-type': 'application/json' }
          })
          if (deleted.status === 'SUCCESS') {
            showSuccess(i18n.pipelineDeleted(data.name || ''))
          }
          ;(column as any).refetchPipeline()
        } catch (err) {
          showError(err?.data?.message)
        }
      }
    }
  })
  return (
    <Layout.Horizontal style={{ justifyContent: 'flex-end' }}>
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
          className={css.actionButton}
          icon="more"
          onClick={e => {
            e.stopPropagation()
            setMenuOpen(true)
          }}
        />
        <Menu style={{ minWidth: 'unset' }}>
          <Menu.Item
            icon="play"
            text={i18n.runPipeline}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              ;(column as any).runPipeline(data.identifier)
              setMenuOpen(false)
            }}
          />
          <Menu.Item
            icon="cog"
            text={i18n.pipelineStudio}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              ;(column as any).goToPipelineStudio(data.identifier)
              setMenuOpen(false)
            }}
          />
          <Menu.Divider />
          <Menu.Item
            icon="trash"
            text={i18n.delete}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              confirmDelete()
              setMenuOpen(false)
            }}
          />
        </Menu>
      </Popover>
    </Layout.Horizontal>
  )
}

const RenderColumnPipeline: Renderer<CellProps<PipelineDTO>> = ({ row }) => {
  const data = row.original
  return (
    <>
      <Layout.Horizontal spacing="small">
        <Text color={Color.BLACK}>{data.name}</Text>
        {data.tags?.length ? <TagsPopover tags={data.tags.map(tag => tag.value)} /> : null}
      </Layout.Horizontal>
      <Text color={Color.GREY_400}>{data.identifier}</Text>
    </>
  )
}

const RenderColumnDescription: Renderer<CellProps<PipelineDTO>> = ({ row }) => {
  const data = row.original
  return (
    <Text color={Color.BLACK} lineClamp={2}>
      {data.description}
    </Text>
  )
}

const RenderColumnAdmin: Renderer<CellProps<PipelineDTO>> = () => {
  return <Icon name="main-user-groups" size={20} />
}

const RenderActivity: Renderer<CellProps<PipelineDTO>> = () => {
  return (
    <span className={css.activityChart}>
      <SparkChart data={[2, 3, 4, 1, 5, 2, 5]} />
    </span>
  )
}

const RenderErrors: Renderer<CellProps<PipelineDTO>> = () => {
  return <Text color={Color.RED_600}>4</Text>
}

const RenderStages: Renderer<CellProps<PipelineDTO>> = () => {
  return (
    <Text
      icon="step-group"
      color={Color.BLACK}
      font="small"
      iconProps={{ size: 12 }}
      style={{ textTransform: 'capitalize' }}
    >
      X {i18n.stages}
    </Text>
  )
}
export const PipelineListView: React.FC<PipelineListViewProps> = ({
  data,
  goToPipelineDetail,
  gotoPage,
  refetchPipeline,
  runPipeline,
  goToPipelineStudio
}): JSX.Element => {
  const columns: CustomColumn<PipelineDTO>[] = React.useMemo(
    () => [
      {
        Header: i18n.pipeline.toUpperCase(),
        accessor: 'name',
        width: '25%',
        Cell: RenderColumnPipeline
      },
      {
        Header: i18n.description.toUpperCase(),
        accessor: 'description',
        width: '20%',
        Cell: RenderColumnDescription,
        disableSortBy: true
      },
      {
        Header: i18n.stages.toUpperCase(),
        accessor: 'stages',
        width: '10%',
        Cell: RenderStages,
        disableSortBy: true
      },
      {
        Header: i18n.activity.toUpperCase(),
        accessor: 'activity',
        width: '15%',
        Cell: RenderActivity,
        disableSortBy: true
      },
      {
        Header: i18n.errors.toUpperCase(),
        accessor: 'errors',
        width: '10%',
        Cell: RenderErrors,
        disableSortBy: true
      },
      {
        Header: i18n.admin.toUpperCase(),
        accessor: 'admin',
        width: '10%',
        Cell: RenderColumnAdmin,
        disableSortBy: true
      },
      {
        Header: i18n.collaborators.toUpperCase(),
        accessor: 'collaborators',
        width: '5%',
        Cell: RenderColumnAdmin,
        disableSortBy: true
      },
      {
        Header: '',
        accessor: 'tags',
        width: '5%',
        Cell: RenderColumnMenu,
        disableSortBy: true,
        refetchPipeline,
        goToPipelineStudio,
        runPipeline
      }
    ],
    [refetchPipeline, runPipeline, goToPipelineStudio]
  )
  return (
    <Table<PipelineDTO>
      className={css.table}
      columns={columns}
      data={data?.content || []}
      onRowClick={item => goToPipelineDetail(item.identifier)}
      pagination={{
        itemCount: data?.totalElements || 0,
        pageSize: data?.size || 10,
        pageCount: data?.totalPages || -1,
        pageIndex: data?.number || 0,
        gotoPage
      }}
    />
  )
}
