import React, { useMemo } from 'react'
import type { CellProps, Renderer } from 'react-table'
import type { GetDataError } from 'restful-react'
import ReactTimeago from 'react-timeago'
import { Tooltip } from '@blueprintjs/core'
import { Color, Container, Icon, Layout, Text } from '@wings-software/uicore'
import DelegateEmptyState from '@connectors/components/CreateConnector/commonSteps/DelegateSelectorStep/icons/DelegateEmptyState.svg'
import Table from '@common/components/Table/Table'
import type { TableProps } from '@common/components/Table/Table'
import { delegateTypeToIcon } from '@common/utils/delegateUtils'
import { useStrings } from 'framework/strings'
import { TagsViewer } from '@common/components/TagsViewer/TagsViewer'
import type { DelegateGroupDetailsCustom } from '@connectors/components/CreateConnector/commonSteps/DelegateSelectorStep/DelegateSelector/DelegateSelector'
import { PageError } from '@common/components/Page/PageError'
import { ContainerSpinner } from '@common/components/ContainerSpinner/ContainerSpinner'
import css from '@connectors/components/CreateConnector/commonSteps/DelegateSelectorStep/DelegateSelector/DelegateSelector.module.scss'

export interface DelegateSelectorTableProps {
  data: DelegateGroupDetailsCustom[]
  loading: boolean
  error: GetDataError<unknown> | null
  refetch: () => Promise<void>
  showMatchesSelectorColumn?: boolean
}

const RenderDelegateIcon: Renderer<CellProps<DelegateGroupDetailsCustom>> = ({ row }) => {
  const { checked } = row.original
  return checked ? (
    <Container flex={{ justifyContent: 'center' }}>
      <Icon name={'tick'} color={Color.GREEN_700} size={24} />
    </Container>
  ) : (
    <></>
  )
}

const RenderDelegateName: Renderer<CellProps<DelegateGroupDetailsCustom>> = ({ row }) => {
  const { delegateType = '', groupHostName, groupName, delegateInstanceDetails, sizeDetails } = row.original
  const { getString } = useStrings()
  const groupNameSubText = getString('delegates.delegateInstances', {
    current: delegateInstanceDetails?.length,
    total: sizeDetails?.replicas
  })
  const groupNameText = `${groupName} ${groupNameSubText}`
  return (
    <Layout.Horizontal>
      <Icon name={delegateTypeToIcon(delegateType)} size={24} />
      <Layout.Vertical padding={{ left: 'small' }} width="85%" className={css.delegateNameContainer}>
        <Tooltip position="top" content={groupNameText}>
          <Text color={Color.BLACK} className={css.delegateName}>
            {groupNameText}
          </Text>
        </Tooltip>
        <Tooltip position="top" content={groupHostName}>
          <Text color={Color.GREY_400} className={css.delegateName}>
            {groupHostName}
          </Text>
        </Tooltip>
      </Layout.Vertical>
    </Layout.Horizontal>
  )
}

const RenderHeartbeat: Renderer<CellProps<DelegateGroupDetailsCustom>> = ({ row }) => {
  const { activelyConnected, lastHeartBeat } = row.original
  const color: Color = activelyConnected ? Color.GREEN_600 : Color.GREY_400
  return (
    <Layout.Horizontal flex={{ alignItems: 'center', justifyContent: 'flex-start' }}>
      <Icon name="full-circle" size={10} color={color} margin={{ right: lastHeartBeat ? 'small' : 0 }} />
      {lastHeartBeat && <ReactTimeago date={lastHeartBeat} live />}
    </Layout.Horizontal>
  )
}

const RenderTags: Renderer<CellProps<DelegateGroupDetailsCustom>> = ({ row }) => {
  const { groupImplicitSelectors } = row.original
  return <TagsViewer tags={Object.keys(groupImplicitSelectors || {})} />
}

export const DelegateSelectorTable: React.FC<DelegateSelectorTableProps> = props => {
  const { data, error, loading, refetch, showMatchesSelectorColumn = true } = props
  const { getString } = useStrings()
  const columns: TableProps<DelegateGroupDetailsCustom>['columns'] = useMemo(
    () => {
      const cols = [
        {
          Header: getString('delegate.DelegateName').toLocaleUpperCase(),
          id: 'name',
          width: '35%',
          Cell: RenderDelegateName
        },
        {
          Header: getString('connectors.delegate.hearbeat').toLocaleUpperCase(),
          id: 'connectivity',
          width: '20%',
          Cell: RenderHeartbeat
        },
        {
          Header: getString('tagsLabel').toLocaleUpperCase(),
          id: 'tags',
          width: showMatchesSelectorColumn ? '35%' : '45%',
          Cell: RenderTags
        }
      ]
      if (showMatchesSelectorColumn) {
        cols.push({
          Header: getString('connectors.delegate.matchesSelectors').toLocaleUpperCase(),
          id: 'delegateIcon',
          width: '10%',
          Cell: RenderDelegateIcon
        })
      }
      return cols
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, showMatchesSelectorColumn]
  )
  const getContent = (): React.ReactElement => {
    if (loading) {
      return <ContainerSpinner data-name="delegateTableLoadingState" />
    }
    if (data && data.length) {
      return <Table columns={columns} data={data} className={css.table} />
    }
    if (error) {
      return <PageError message={error?.message} onClick={() => refetch()} data-name="delegateTableErrorState" />
    }
    return (
      <Layout.Vertical height="100%" flex={{ align: 'center-center' }} data-name="delegateTableEmptyState">
        <img width="100%" height="100%" src={DelegateEmptyState} style={{ alignSelf: 'center' }} />
        <Text>{getString('connectors.delegate.noDelegates')}</Text>
      </Layout.Vertical>
    )
  }
  return (
    <Container
      padding={{ left: 'small', right: 'small', top: 'small' }}
      background={Color.WHITE}
      height={265}
      data-name="delegateContentContainer"
    >
      {getContent()}
    </Container>
  )
}
