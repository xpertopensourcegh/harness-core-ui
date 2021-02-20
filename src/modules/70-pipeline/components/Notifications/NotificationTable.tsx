import React, { useState, useMemo } from 'react'
import { Text, Layout, Color, Button, Popover, Switch, Container, Icon, Select } from '@wings-software/uicore'
import type { CellProps, Renderer, Column } from 'react-table'
import { Classes, Menu, PopoverInteractionKind, Position, Tag } from '@blueprintjs/core'
import { startCase } from 'lodash-es'
import produce from 'immer'
import Table from '@common/components/Table/Table'
import { useStrings } from 'framework/exports'
import type { NotificationRules, PipelineEvent } from 'services/pipeline-ng'
import { getIconByNotificationMethod } from '@notifications/Utils/Utils'
import type { NotificationType } from '@notifications/interfaces/Notifications'
import { useNotificationModal } from './useNotificationModal'
import { PipelineEventType } from './Steps/PipelineEvents'
import { Actions } from './NotificationUtils'
import css from './NotificationTable.module.scss'

export interface NotificationTableProps {
  data: NotificationRules[]
  onUpdate?: (data?: NotificationRules, index?: number, action?: Actions, closeModal?: () => void) => void
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
        ;(column as any).onUpdate?.(
          produce(data, draft => {
            draft.enabled = e.currentTarget.checked
          }),
          row.id,
          Actions.Update
        )
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
  const data = row.original.pipelineEvents?.map(event => event.type)
  const baseData = data?.slice(0, 3)
  const popoverData = data?.slice(3, data.length)
  return (
    <Layout.Horizontal spacing="xsmall">
      {baseData?.map(event => (
        <Tag round={true} key={event} style={{ backgroundColor: getPipelineEventColor(event) }}>
          {startCase(event)}
        </Tag>
      ))}
      {popoverData?.length ? (
        <Popover interactionKind={PopoverInteractionKind.HOVER}>
          <Layout.Horizontal flex={{ align: 'center-center' }} spacing="xsmall">
            <Icon name="main-tags" size={15} />
          </Layout.Horizontal>
          <Layout.Vertical padding="small" spacing="small">
            {popoverData?.map(event => (
              <Tag round={true} key={event} style={{ backgroundColor: getPipelineEventColor(event) }}>
                {startCase(event)}
              </Tag>
            ))}
          </Layout.Vertical>
        </Popover>
      ) : null}
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
    ;(column as any).openNotificationModal?.(data)
  }

  const handleDelete = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    event.stopPropagation()
    setMenuOpen?.(false)
    ;(column as any).onUpdate?.(row, row.id, Actions.Delete)
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
  const { data, onUpdate } = props
  const { getString } = useStrings()
  const { openNotificationModal, closeNotificationModal } = useNotificationModal({
    onCreateOrUpdate: (_data?: NotificationRules, _index?: number, _action?: Actions) => {
      onUpdate?.(_data, _index, _action, closeNotificationModal)
    }
  })

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
        width: '35%',
        Cell: RenderColumnEvents,
        disableSortBy: true
      },
      {
        Header: getString('pipeline-notifications.notificationMethod').toUpperCase(),
        id: 'methods',
        accessor: row => row.notificationMethod?.type,
        width: '25%',
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
    <Container>
      <Layout.Horizontal flex className={css.headerActions}>
        <Button
          intent="primary"
          text={getString('notifications')}
          icon="plus"
          id="newNotificationBtn"
          onClick={() => openNotificationModal()}
        />

        <Select
          value={{
            label: getString('allNotificationFormat'),
            value: getString('allNotificationFormat')
          }}
          items={[
            {
              label: getString('allNotificationFormat'),
              value: getString('allNotificationFormat')
            }
          ]}
          className={css.filterDropdown}
        />
      </Layout.Horizontal>
      <Container padding={{ bottom: 'huge' }} className={css.content}>
        <Table<NotificationRules> columns={columns} data={data} className={css.notificationTable} />
      </Container>
    </Container>
  )
}

export default NotificationTable
