import React from 'react'
import type { CellProps, Column, Renderer } from 'react-table'
import { Button, Color, Layout, Popover, Text, Icon, SparkChart } from '@wings-software/uikit'
import { Classes, Menu, Position } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'
import Table from '@common/components/Table/Table'
import { NGPipelineSummaryResponse, PageNGPipelineSummaryResponse, useSoftDeletePipeline } from 'services/cd-ng'
import TagsPopover from '@common/components/TagsPopover/TagsPopover'
import { useConfirmationDialog, useToaster } from '@common/exports'
import { RunPipelineModal } from '@pipeline/components/RunPipelineModal/RunPipelineModal'
import i18n from '../PipelinesPage.i18n'
import css from '../PipelinesPage.module.scss'

interface PipelineListViewProps {
  data?: PageNGPipelineSummaryResponse
  gotoPage: (pageNumber: number) => void
  goToPipelineDetail: (pipelineIdentifier?: string) => void
  goToPipelineStudio: (pipelineIdentifier?: string) => void
  refetchPipeline: () => void
}

// Todo: Remove this when BE updated
interface PipelineDTO extends NGPipelineSummaryResponse {
  admin?: string
  collaborators?: string
  status?: string
}

type CustomColumn<T extends object> = Column<T> & {
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
    contentText: i18n.confirmDelete(data.name || /* istanbul ignore next */ ''),
    titleText: i18n.confirmDeleteTitle,
    confirmButtonText: i18n.deleteButton,
    cancelButtonText: i18n.cancel,
    onCloseDialog: async (isConfirmed: boolean) => {
      /* istanbul ignore else */
      if (isConfirmed) {
        try {
          const deleted = await deletePipeline(data.identifier || /* istanbul ignore next */ '', {
            headers: { 'content-type': 'application/json' }
          })
          /* istanbul ignore else */
          if (deleted.status === 'SUCCESS') {
            showSuccess(i18n.pipelineDeleted(data.name || /* istanbul ignore next */ ''))
          }
          ;(column as any).refetchPipeline()
        } catch (err) {
          /* istanbul ignore next */
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
          <RunPipelineModal pipelineIdentifier={data.identifier || /* istanbul ignore next */ ''}>
            <Menu.Item icon="play" text={i18n.runPipeline} />
          </RunPipelineModal>
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
      <Layout.Horizontal spacing="small" data-testid={data.identifier}>
        <Text color={Color.BLACK}>{data.name}</Text>
        {data.tags?.length ? (
          <TagsPopover
            tags={Object.entries(data.tags).map(tag => (tag[1].length > 0 ? `${tag[0]}: ${tag[1]}` : tag[0]))}
          />
        ) : null}
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

const RenderActivity: Renderer<CellProps<PipelineDTO>> = ({ row }) => {
  const data = row.original
  return (
    <span className={css.activityChart}>
      <SparkChart data={data.deployments || /* istanbul ignore next */ []} />
    </span>
  )
}

const RenderErrors: Renderer<CellProps<PipelineDTO>> = ({ row }) => {
  return <Text color={Color.RED_600}>{row.original.numOfErrors || '-'}</Text>
}

const RenderStages: Renderer<CellProps<PipelineDTO>> = ({ row }) => {
  return (
    <Text
      icon="step-group"
      color={Color.BLACK}
      font="small"
      iconProps={{ size: 12 }}
      style={{ textTransform: 'capitalize' }}
    >
      {row.original.numOfStages} {i18n.stages}
    </Text>
  )
}
export const PipelineListView: React.FC<PipelineListViewProps> = ({
  data,
  goToPipelineDetail,
  gotoPage,
  refetchPipeline,
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
        accessor: 'numOfStages',
        width: '10%',
        Cell: RenderStages,
        disableSortBy: true
      },
      {
        Header: i18n.activity.toUpperCase(),
        accessor: 'deployments',
        width: '15%',
        Cell: RenderActivity,
        disableSortBy: true
      },
      {
        Header: i18n.errors.toUpperCase(),
        accessor: 'numOfErrors',
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
        goToPipelineStudio
      }
    ],
    [refetchPipeline, goToPipelineStudio]
  )
  return (
    <Table<PipelineDTO>
      className={css.table}
      columns={columns}
      data={data?.content || /* istanbul ignore next */ []}
      onRowClick={item => goToPipelineDetail(item.identifier)}
      pagination={{
        itemCount: data?.totalElements || /* istanbul ignore next */ 0,
        pageSize: data?.size || /* istanbul ignore next */ 10,
        pageCount: data?.totalPages || /* istanbul ignore next */ -1,
        pageIndex: data?.number || /* istanbul ignore next */ 0,
        gotoPage
      }}
    />
  )
}
