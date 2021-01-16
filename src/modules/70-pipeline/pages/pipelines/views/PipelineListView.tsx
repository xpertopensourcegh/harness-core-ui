import React from 'react'
import type { CellProps, Column, Renderer } from 'react-table'
import { Button, Color, Layout, Popover, Text, SparkChart, Icon } from '@wings-software/uicore'
import { Classes, Menu, Position } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'
import Table from '@common/components/Table/Table'
import TagsPopover from '@common/components/TagsPopover/TagsPopover'
import { formatDatetoLocale } from '@common/utils/dateUtils'
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
      <Layout.Vertical spacing="small" data-testid={data.identifier}>
        <Text color={Color.GREY_800} iconProps={{ size: 16 }}>
          {data.name}
        </Text>
        <Text color={Color.GREY_400}>{data.description}</Text>
      </Layout.Vertical>
    </>
  )
}

const RenderColumnTag: Renderer<CellProps<PipelineDTO>> = ({ row }) => {
  const data = row.original
  if (data.tags && Object.keys(data.tags || {}).length) {
    return <TagsPopover tags={data.tags} />
  }
  return <div></div>
}

const RenderActivity: Renderer<CellProps<PipelineDTO>> = ({ row }) => {
  const data = row.original

  const deployments = data.executionSummaryInfo?.deployments?.reduce((acc, val) => acc + val, 0)
  const { getString } = useStrings()

  const getStatusColor = (): string => {
    switch (data.executionSummaryInfo?.lastExecutionStatus) {
      case 'Success':
        return Color.GREEN_800
      case 'Failed':
        return Color.RED_800
      case 'Running':
        return Color.BLUE_800
      default:
        return Color.GREEN_800
    }
  }

  return (
    <Layout.Horizontal spacing="large" style={{ alignItems: 'center' }}>
      {data.executionSummaryInfo?.deployments?.length ? (
        <span className={css.activityChartList}>
          <SparkChart data={data.executionSummaryInfo?.deployments || []} />
        </span>
      ) : null}

      <Text color={Color.GREY_400} font="medium" iconProps={{ size: 18 }}>
        {deployments}
      </Text>

      {deployments ? (
        <Text color={Color.GREY_400} font="small" lineClamp={2} style={{ maxWidth: 100 }}>
          {getString('pipelineActivityLabel')}
        </Text>
      ) : null}

      <Layout.Horizontal spacing="medium">
        <Text color={Color.GREY_400}>
          <span>Last run:</span>
        </Text>
        <Text>
          <span>
            {data.executionSummaryInfo?.lastExecutionTs
              ? formatDatetoLocale(data.executionSummaryInfo?.lastExecutionTs)
              : getString('pipelineSteps.pullNeverLabel')}
          </span>
        </Text>
      </Layout.Horizontal>

      {data.executionSummaryInfo?.lastExecutionStatus ? (
        <Icon name="full-circle" size={8} color={getStatusColor()} />
      ) : null}
    </Layout.Horizontal>
  )
}

const RenderRunPipeline: Renderer<CellProps<PipelineDTO>> = ({ row }): JSX.Element => {
  const rowdata = row.original
  return (
    <RunPipelineModal pipelineIdentifier={rowdata.identifier || ''}>
      <Button
        style={{ textAlign: 'end' }}
        intent="primary"
        icon="run-pipeline"
        text={<String stringID="runPipelineText" />}
      />
    </RunPipelineModal>
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
        Header: '',
        accessor: 'description',
        width: '10%',
        Cell: RenderColumnTag,
        disableSortBy: true
      },
      {
        Header: getString('activity').toUpperCase(),
        accessor: 'executionSummaryInfo',
        width: '50%',
        Cell: RenderActivity,
        disableSortBy: true
      },
      {
        Header: '',
        accessor: 'tags',
        width: '10%',
        Cell: RenderRunPipeline,
        disableSortBy: true,
        refetchPipeline,
        goToPipelineStudio
      },
      {
        Header: '',
        accessor: 'version',
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
    <Layout.Vertical>
      <Layout.Horizontal spacing="large" margin={{ left: 'xxlarge', top: 'large', bottom: 'large' }}>
        <Text color={Color.GREY_800} iconProps={{ size: 14 }}>
          {getString('total')}: {data?.totalElements}
        </Text>
      </Layout.Horizontal>

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
    </Layout.Vertical>
  )
}
