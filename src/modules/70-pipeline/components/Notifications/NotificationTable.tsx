import React, { useState, useMemo } from 'react'
import { Text, Layout, Color, Button, Popover, Switch, Pagination, Container, Icon } from '@wings-software/uicore'
import type { CellProps, Renderer, Column } from 'react-table'
import { Classes, Menu, Position, Tag } from '@blueprintjs/core'
import { startCase } from 'lodash-es'
import Table from '@common/components/Table/Table'
import { useStrings } from 'framework/exports'
import type { NotificationRules, PipelineEvent } from 'services/pipeline-ng'
import { getIconByNotificationMethod } from '@notifications/Utils/Utils'
import type { NotificationType } from '@notifications/interfaces/Notifications'
import { useNotificationModal } from './useNotificationModal'
import { PipelineEventType } from './Steps/PipelineEvents'

export interface NotificationTableProps {
  data: NotificationRules[]
  onUpdate?: (data?: NotificationRules, index?: number) => void
  gotoPage: (index: number) => void
  totalPages?: number
  totalItems?: number
  pageItemCount?: number
  pageSize?: number
  pageIndex?: number
}

type CustomColumn<T extends object> = Column<T> & {
  onUpdate?: (data: NotificationRules, index: number) => void
}

export const getPipelineEventColor = (option?: Required<PipelineEvent>['type']): Color => {
  switch (option) {
    case PipelineEventType.ALL_EVENTS:
      return Color.BLUE_500
    case PipelineEventType.PipelineSuccess:
      return Color.BLUE_300
    case PipelineEventType.StageSuccess:
      return Color.BLUE_300
    case PipelineEventType.StageFailed:
      return Color.BLUE_300
    case PipelineEventType.StageStart:
      return Color.BLUE_300
    case PipelineEventType.StepFailed:
      return Color.BLUE_300
  }
  return Color.GREY_200
}

const RenderColumnEnabled: Renderer<CellProps<NotificationRules>> = ({ row, column }) => {
  const data = row.original
  return (
    <Switch
      checked={data.enabled}
      onChange={e => {
        data.enabled = e.currentTarget.checked
        ;(column as any).onUpdate?.(data, row.id)
      }}
    />
  )
}
const RenderColumnName: Renderer<CellProps<NotificationRules>> = ({ row }) => {
  const data = row.original
  return (
    <Text color={Color.BLACK} lineClamp={1}>
      {data.name}
    </Text>
  )
}

const RenderColumnEvents: Renderer<CellProps<NotificationRules>> = ({ row }) => {
  const data = row.original.pipelineEvents
  return (
    <Layout.Horizontal spacing="xsmall">
      {data?.map(event => (
        <Tag round={true} key={event.type} style={{ backgroundColor: getPipelineEventColor(event.type) }}>
          {startCase(event.type)}
        </Tag>
      ))}
    </Layout.Horizontal>
  )
}

const RenderColumnMethod: Renderer<CellProps<NotificationRules>> = ({ row }) => {
  const data = row.original.notificationMethod?.type
  return (
    <Layout.Horizontal spacing="small">
      <Icon name={getIconByNotificationMethod(data as NotificationType)} />
      <Text>{data}</Text>
    </Layout.Horizontal>
  )
}

const RenderColumnMenu: Renderer<CellProps<NotificationRules>> = ({ row, column }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { getString } = useStrings()
  const data = row.original

  const handleEdit = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    event.stopPropagation()
    setMenuOpen?.(false)
    ;(column as any).openNotificationModal?.(data, row.id)
  }

  const handleDelete = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    event.stopPropagation()
    setMenuOpen?.(false)
    ;(column as any).onUpdate?.(undefined, row.id)
  }
  return (
    <Layout.Horizontal>
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
          icon="Options"
          iconProps={{ size: 24 }}
          onClick={e => {
            e.stopPropagation()
            setMenuOpen(true)
          }}
        />
        <Menu>
          <Menu.Item icon="edit" text={getString('edit')} onClick={handleEdit} />
          <Menu.Item icon="trash" text={getString('delete')} onClick={handleDelete} />
        </Menu>
      </Popover>
    </Layout.Horizontal>
  )
}

const NotificationTable: React.FC<NotificationTableProps> = props => {
  const { data, gotoPage, onUpdate, totalItems = 0, pageSize = 5, totalPages = 1, pageIndex = 0 } = props
  const { getString } = useStrings()
  const { openNotificationModal } = useNotificationModal({})

  const columns: CustomColumn<NotificationRules>[] = useMemo(
    () => [
      {
        Header: getString('enabledLabel').toUpperCase(),
        id: 'enabled',
        accessor: 'enabled',
        onUpdate: onUpdate,
        width: '15%',
        Cell: RenderColumnEnabled,
        disableSortBy: true
      },
      {
        Header: getString('pipeline-notifications.nameOftheRule').toUpperCase(),
        id: 'name',
        accessor: 'name',
        width: '20%',
        Cell: RenderColumnName,
        disableSortBy: true
      },
      {
        Header: getString('pipeline-notifications.pipelineEvents').toUpperCase(),
        id: 'events',
        accessor: row => row.pipelineEvents,
        width: '30%',
        Cell: RenderColumnEvents,
        disableSortBy: true
      },
      {
        Header: getString('pipeline-notifications.notificationMethod').toUpperCase(),
        id: 'methods',
        accessor: row => row.notificationMethod?.type,
        width: '30%',
        Cell: RenderColumnMethod,
        disableSortBy: true
      },
      {
        Header: '',
        id: 'menu',
        accessor: row => row.notificationMethod?.spec,
        width: '5%',
        Cell: RenderColumnMenu,
        onUpdate: onUpdate,
        openNotificationModal: openNotificationModal,
        disableSortBy: true
      }
    ],
    [onUpdate, openNotificationModal]
  )
  return (
    <>
      <Container padding={{ bottom: 'huge' }}>
        <Table<NotificationRules> columns={columns} data={data} />
        <Button minimal onClick={() => openNotificationModal()}>
          {getString('addNotification')}
        </Button>
      </Container>
      <Pagination
        itemCount={totalItems}
        pageSize={pageSize}
        pageCount={totalPages}
        pageIndex={pageIndex}
        gotoPage={gotoPage}
      />
    </>
  )
}

export default NotificationTable
