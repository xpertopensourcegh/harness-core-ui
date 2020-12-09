import React from 'react'
import ReactTimeago from 'react-timeago'
import { useParams } from 'react-router-dom'
import type { CellProps, Renderer } from 'react-table'
import { Button, Color, Layout, Popover, Text, Icon, Switch, IconName } from '@wings-software/uikit'
import copy from 'clipboard-copy'
import { Classes, Menu, Position } from '@blueprintjs/core'
import { isUndefined, isEmpty } from 'lodash-es'
import type { tagsType } from '@common/utils/types'
import Table from '@common/components/Table/Table'
import {
  NGTriggerDetailsResponse,
  useDeleteTrigger,
  useUpdateTriggerStatus,
  GetActionsListQueryParams
} from 'services/cd-ng'
import { useConfirmationDialog, useToaster } from '@common/exports'
import TagsPopover from '@common/components/TagsPopover/TagsPopover'
import { useStrings } from 'framework/exports'
import { GitSourceProviders } from '../utils/TriggersListUtils'
import { TriggerTypes } from '../utils/TriggersWizardPageUtils'

import css from './TriggersListSection.module.scss'
export interface GoToEditWizardInterface {
  triggerIdentifier: string
  // only used for url not showing undefined
  triggerType?: string
}
interface TriggersListSectionProps {
  data?: NGTriggerDetailsResponse[] // BE accidentally reversed. Will be changed to NGTriggerResponse later
  refetchTriggerList: () => void
  goToEditWizard: ({ triggerIdentifier, triggerType }: GoToEditWizardInterface) => void
}

// type CustomColumn<T extends object> = Column<T> & {
//   refetchTriggerList?: () => void
//   goToEditWizard?: ({ triggerIdentifier, triggerType }: GoToEditWizardInterface) => void
//   getString?: (key: string) => string
// }

interface RenderColumnRow {
  original: NGTriggerDetailsResponse
}
interface RenderColumnMenuColumn {
  refetchTriggerList: () => void
  goToEditWizard: ({ triggerIdentifier, triggerType }: { triggerIdentifier: string; triggerType: string }) => void
  showSuccess: (str: string) => void
  showError: (str: string) => void
  getString: (str: string) => string
  projectIdentifier: string
  orgIdentifier: string
  accountId: string
  pipelineIdentifier: string
}

const RenderColumnMenu: Renderer<CellProps<NGTriggerDetailsResponse>> = ({
  row,
  column
}: {
  row: RenderColumnRow
  column: RenderColumnMenuColumn
}) => {
  const data = row.original
  const [menuOpen, setMenuOpen] = React.useState(false)
  const { mutate: deleteTrigger } = useDeleteTrigger({
    queryParams: {
      accountIdentifier: column.accountId,
      orgIdentifier: column.orgIdentifier,
      projectIdentifier: column.projectIdentifier,
      targetIdentifier: column.pipelineIdentifier
    }
  })

  const { openDialog: confirmDelete } = useConfirmationDialog({
    contentText: `${column.getString('pipeline-triggers.confirmDelete')} ${data.name || /* istanbul ignore next */ ''}`,
    titleText: column.getString('pipeline-triggers.triggerLabel'),
    confirmButtonText: column.getString('delete'),
    cancelButtonText: column.getString('cancel'),
    onCloseDialog: async (isConfirmed: boolean) => {
      /* istanbul ignore else */
      if (isConfirmed) {
        try {
          const deleted = await deleteTrigger(data.identifier || /* istanbul ignore next */ '', {
            headers: { 'content-type': 'application/json' }
          })
          /* istanbul ignore else */
          if (deleted.status === 'SUCCESS') {
            column.showSuccess(
              `${column.getString('pipeline-triggers.triggerLabel')} ${
                data.name || /* istanbul ignore next */ ''
              } ${column.getString('deleted')}`
            )
          }
          column.refetchTriggerList?.()
        } catch (err) {
          /* istanbul ignore next */
          column.showError(err?.data?.message)
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
            icon="edit"
            text={column.getString('edit')}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              if (data?.identifier && data.type) {
                column.goToEditWizard({ triggerIdentifier: data.identifier, triggerType: data.type })
              }
              setMenuOpen(false)
            }}
          />
          <Menu.Divider />
          <Menu.Item
            icon="trash"
            text={column.getString('delete')}
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

const RenderCenteredColumnHeader = (header: string): JSX.Element => <div className={css.textCentered}>{header}</div>

const getIcon = ({
  type,
  webhookSourceRepo
}: {
  type: string
  webhookSourceRepo: GetActionsListQueryParams['sourceRepo'] | undefined | string // string temporary until backend
}): IconName => {
  const webhookSourceRepoIconName =
    webhookSourceRepo && GitSourceProviders[webhookSourceRepo as GetActionsListQueryParams['sourceRepo']]?.iconName
  if (type === TriggerTypes.WEBHOOK && webhookSourceRepoIconName) {
    return webhookSourceRepoIconName as IconName
  }
  // placeholder for now
  return GitSourceProviders.GITHUB?.iconName as IconName
}
const RenderColumnTrigger: Renderer<CellProps<NGTriggerDetailsResponse>> = ({ row }) => {
  const data = row.original
  return (
    <>
      <Layout.Horizontal spacing="small" data-testid={data.identifier}>
        <Icon
          name={
            data.type
              ? getIcon({ type: data.type, webhookSourceRepo: data?.webhookDetails?.webhookSourceRepo })
              : 'deployment-success-new'
          }
          size={26}
        />
        <Layout.Vertical padding={{ left: 'small' }}>
          <Layout.Horizontal spacing="small" data-testid={data.identifier}>
            <Text color={Color.BLACK}>{data.name}</Text>
            {!isEmpty(data.tags) ? <TagsPopover tags={data.tags as tagsType} /> : null}
          </Layout.Horizontal>
          <Text color={Color.GREY_400}>{data.identifier}</Text>
        </Layout.Vertical>
      </Layout.Horizontal>
    </>
  )
}

const RenderColumnCondition: Renderer<CellProps<NGTriggerDetailsResponse>> = ({ row }) => {
  const data = row.original
  return (
    <Layout.Horizontal spacing="small" data-testid={data.identifier}>
      <Text color={Color.GREY_400}>Work in Progress</Text>
    </Layout.Horizontal>
  )
}

const RenderColumnActivity: Renderer<CellProps<NGTriggerDetailsResponse>> = ({ row }) => {
  const data = row.original
  const lastExecutionTime = data.lastTriggerExecutionDetails?.lastExecutionTime
  return (
    <Layout.Horizontal style={{ justifyContent: 'center' }} spacing="small" data-testid={data.identifier}>
      <div className={css.activityStatement}>
        {!isUndefined(data.lastTriggerExecutionDetails?.lastExecutionTime) &&
        !isUndefined(data.lastTriggerExecutionDetails?.lastExecutionTime) ? (
          <Text
            icon={
              data.lastTriggerExecutionDetails?.lastExecutionSuccessful
                ? 'deployment-success-new'
                : 'deployment-incomplete-new'
            }
          >
            {lastExecutionTime ? <ReactTimeago date={lastExecutionTime} /> : null}
          </Text>
        ) : null}
      </div>
    </Layout.Horizontal>
  )
}

const RenderColumnExecutionLog: Renderer<CellProps<NGTriggerDetailsResponse>> = ({ row }) => {
  const data = row.original
  return (
    <Layout.Horizontal style={{ justifyContent: 'center' }} spacing="small" data-testid={data.identifier}>
      <Text font="medium" icon="document-open" color={Color.GREY_400}>
        (WIP)
      </Text>
    </Layout.Horizontal>
  )
}

const RenderColumnWebhook: Renderer<CellProps<NGTriggerDetailsResponse>> = ({
  column
}: {
  column: { accountId: string }
}) => {
  const webhookUrl = window.location.origin + `/ng/api/webhook/trigger?accountIdentifier=${column.accountId}`
  return (
    <div className={css.textCentered}>
      <Icon
        style={{ cursor: 'pointer' }}
        name="main-link"
        size={20}
        color="blue500"
        onClick={() => {
          copy(webhookUrl)
          ;(column as any).showSuccess('Webhook URL is copied to clipboard.')
        }}
      />
    </div>
  )
}

const RenderColumnEnable: Renderer<CellProps<NGTriggerDetailsResponse>> = ({
  row,
  column
}: {
  row: RenderColumnRow
  column: {
    showSuccess: (str: string) => void
    showError: (str: string) => void
    refetchTriggerList: () => void
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
    pipelineIdentifier: string
  }
}) => {
  const data = row.original

  const { mutate: updateTriggerStatus } = useUpdateTriggerStatus({
    triggerIdentifier: data.identifier as string,
    queryParams: {
      accountIdentifier: column.accountId,
      orgIdentifier: column.orgIdentifier,
      projectIdentifier: column.projectIdentifier,
      targetIdentifier: column.pipelineIdentifier,
      status: !data.enabled
    },
    requestOptions: { headers: { 'content-type': 'application/yaml' } }
  })
  return (
    <div className={css.textCentered}>
      <Switch
        label=""
        checked={data.enabled}
        onChange={async () => {
          const updated = await updateTriggerStatus()

          if (updated.status === 'SUCCESS') {
            column.showSuccess(`Successfully ${!data.enabled ? 'enabled' : 'disabled'} ${data.name}`)
            column.refetchTriggerList?.()
          } else if (updated.status === 'ERROR') {
            column.showError('Error')
          }
        }}
      />
    </div>
  )
}

export const TriggersListSection: React.FC<TriggersListSectionProps> = ({
  data,
  refetchTriggerList,
  goToEditWizard
}): JSX.Element => {
  const { getString } = useStrings()
  const { showSuccess, showError } = useToaster()
  const { projectIdentifier, orgIdentifier, accountId, pipelineIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
    pipelineIdentifier: string
  }>()
  const columns: any = React.useMemo(
    // const columns: CustomColumn<NGTriggerDetailsResponse>[] = React.useMemo( // wait for backend to support condition
    () => [
      {
        Header: getString('pipeline-triggers.triggerLabel').toUpperCase(),
        accessor: 'name',
        width: '25%',
        Cell: RenderColumnTrigger
      },
      {
        Header: 'CONDITION',
        accessor: 'condition',
        width: '26%',
        Cell: RenderColumnCondition,
        headerClassName: 'centerHeader'
      },
      {
        Header: RenderCenteredColumnHeader(' LAST ACTIVITY STATUS'),
        accessor: 'activity',
        width: '20%',
        Cell: RenderColumnActivity,
        disableSortBy: true,
        headerClassName: css.textCentered
      },
      {
        Header: RenderCenteredColumnHeader('EXECUTION HISTORY'),
        accessor: 'executionLog',
        width: '10%',
        Cell: RenderColumnExecutionLog,
        disableSortBy: true
      },
      {
        Header: RenderCenteredColumnHeader('WEBHOOK'),
        accessor: 'webhook',
        width: '8%',
        Cell: RenderColumnWebhook,
        disableSortBy: true,
        showSuccess,
        accountId
      },
      {
        Header: RenderCenteredColumnHeader('ENABLE'),
        accessor: 'enable',
        width: '8%',
        Cell: RenderColumnEnable,
        disableSortBy: true,
        projectIdentifier,
        orgIdentifier,
        accountId,
        pipelineIdentifier,
        showSuccess,
        showError,
        refetchTriggerList
      },
      {
        Header: '',
        accessor: 'type',
        width: '3%',
        Cell: RenderColumnMenu,
        disableSortBy: true,
        refetchTriggerList,
        goToEditWizard,
        showSuccess,
        showError,
        projectIdentifier,
        orgIdentifier,
        accountId,
        pipelineIdentifier,
        getString
      }
    ],
    [goToEditWizard, refetchTriggerList, getString]
  )
  return (
    <Table<NGTriggerDetailsResponse>
      className={css.table}
      columns={columns}
      data={data || /* istanbul ignore next */ []}
    />
  )
}
