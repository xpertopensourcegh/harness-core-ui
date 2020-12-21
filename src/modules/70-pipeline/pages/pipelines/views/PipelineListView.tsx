import React from 'react'
import type { CellProps, Column, Renderer } from 'react-table'
import { Button, Color, Layout, Popover, Text, SparkChart } from '@wings-software/uikit'
import { Classes, Menu, Position } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'
import Table from '@common/components/Table/Table'
import TagsPopover from '@common/components/TagsPopover/TagsPopover'
import { useConfirmationDialog, useToaster } from '@common/exports'
import { RunPipelineModal } from '@pipeline/components/RunPipelineModal/RunPipelineModal'
import { PagePMSPipelineSummaryResponse, PMSPipelineSummaryResponse, useSoftDeletePipeline } from 'services/pipeline-ng'
import { String, useStrings } from 'framework/exports'
import css from '../PipelinesPage.module.scss'

interface PipelineListViewProps {
  data?: PagePMSPipelineSummaryResponse
  gotoPage: (pageNumber: number) => void
  goToPipelineDetail: (pipelineIdentifier?: string) => void
  goToPipelineStudio: (pipelineIdentifier?: string) => void
  refetchPipeline: () => void
}

// Todo: Remove this when BE updated
interface PipelineDTO extends PMSPipelineSummaryResponse {
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

  const { getString } = useStrings()

  const { openDialog: confirmDelete } = useConfirmationDialog({
    contentText: getString('pipeline-list.confirmDelete', { name: data.name }),
    titleText: getString('pipeline-list.confirmDeleteTitle'),
    confirmButtonText: getString('delete'),
    cancelButtonText: getString('cancel'),
    onCloseDialog: async (isConfirmed: boolean) => {
      /* istanbul ignore else */
      if (isConfirmed) {
        try {
          const deleted = await deletePipeline(data.identifier || /* istanbul ignore next */ '', {
            headers: { 'content-type': 'application/json' }
          })
          /* istanbul ignore else */
          if (deleted.status === 'SUCCESS') {
            showSuccess(getString('pipeline-list.pipelineDeleted', { name: data.name }))
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
            <Menu.Item icon="play" text={getString('runPipelineText')} />
          </RunPipelineModal>
          <Menu.Item
            icon="cog"
            text={getString('pipelineStudio')}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              ;(column as any).goToPipelineStudio(data.identifier)
              setMenuOpen(false)
            }}
          />
          <Menu.Divider />
          <Menu.Item
            icon="trash"
            text={getString('delete')}
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
        {data.tags && Object.keys(data.tags || {}).length ? <TagsPopover tags={data.tags} /> : null}
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
      {row.original.numOfStages} <String stringID="pipeline-list.listStages" />
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
  const { getString } = useStrings()
  const columns: CustomColumn<PipelineDTO>[] = React.useMemo(
    () => [
      {
        Header: getString('pipeline').toUpperCase(),
        accessor: 'name',
        width: '25%',
        Cell: RenderColumnPipeline
      },
      {
        Header: getString('description').toUpperCase(),
        accessor: 'description',
        width: '25%',
        Cell: RenderColumnDescription,
        disableSortBy: true
      },
      {
        Header: getString('pipeline-list.listStages').toUpperCase(),
        accessor: 'numOfStages',
        width: '10%',
        Cell: RenderStages,
        disableSortBy: true
      },
      {
        Header: getString('activity').toUpperCase(),
        accessor: 'deployments',
        width: '20%',
        Cell: RenderActivity,
        disableSortBy: true
      },
      {
        Header: getString('errors').toUpperCase(),
        accessor: 'numOfErrors',
        width: '10%',
        Cell: RenderErrors,
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
