import React, { useMemo } from 'react'
import cx from 'classnames'
import type { CellProps, Column, Renderer } from 'react-table'
import ReactTimeago from 'react-timeago'
import { Layout, Text, Color } from '@wings-software/uicore'
import Table from '@common/components/Table/Table'
import { useStrings } from 'framework/exports'
import type { PageResourceGroupResponse, ResourceGroupResponse } from 'services/cd-ng'
import ResourceGroupColumnMenu from './ResourceGroupColumnMenu'

import css from './ResourceGroupList.module.scss'
interface ResourceGroupListViewProps {
  data?: PageResourceGroupResponse
  reload?: () => Promise<void>
  openResourceGroupModal: () => void
  goToPage: (pageNumber: number) => void
}
const RenderColumnDetails: Renderer<CellProps<ResourceGroupResponse>> = ({ row }) => {
  const data = row.original
  return data.resourceGroup ? (
    <Layout.Horizontal spacing="small">
      <div style={{ backgroundColor: data.resourceGroup.color }} className={cx(css.resourceGroupColor)}></div>
      <Text color={Color.BLACK} lineClamp={1}>
        {data.resourceGroup.name}
      </Text>
    </Layout.Horizontal>
  ) : null
}

const RenderColumnLastUpdated: Renderer<CellProps<ResourceGroupResponse>> = ({ row }) => {
  const data = row.original
  return data.lastModifiedAt ? (
    <Text color={Color.BLACK} lineClamp={1}>
      <ReactTimeago date={data.lastModifiedAt} />
    </Text>
  ) : null
}

const RenderColumnSummary: Renderer<CellProps<ResourceGroupResponse>> = ({ row }) => {
  const { getString } = useStrings()
  const rowData = row.original
  return rowData?.resourceGroup?.resourceSelectors?.length ? (
    // TODO: replace with the summary data
    <Text color={Color.BLACK} lineClamp={1}>
      Construct summary TBD
    </Text>
  ) : (
    // TODO: replace with view change action
    <Text color={Color.BLUE_400}>{getString('selectResource')}</Text>
  )
}
const ResourceGroupListView: React.FC<ResourceGroupListViewProps> = props => {
  const { data, reload, openResourceGroupModal, goToPage } = props
  const { getString } = useStrings()
  const listData: ResourceGroupResponse[] = data?.content || []
  const columns: Column<ResourceGroupResponse>[] = useMemo(
    () => [
      {
        Header: getString('resourceGroup.resourceGroupColumn'),
        accessor: row => row.resourceGroup.name,
        id: 'name',
        width: '32%',
        Cell: RenderColumnDetails
      },
      {
        Header: getString('resourceGroup.summary'),
        accessor: row => row.resourceGroup.resourceSelectors,
        id: 'summary',
        width: '32%',
        Cell: RenderColumnSummary
      },
      {
        Header: getString('lastUpdated'),
        accessor: row => row.lastModifiedAt,
        id: 'lastUpdated',
        width: '32%',
        Cell: RenderColumnLastUpdated
      },
      {
        Header: '',
        accessor: row => row.resourceGroup?.identifier,
        width: '4%',
        id: 'action',
        Cell: ResourceGroupColumnMenu,
        disableSortBy: true,
        reload: reload,
        openResourceGroupModal
      }
    ],
    [props.data]
  )

  return (
    <Table<ResourceGroupResponse>
      columns={columns}
      data={listData}
      pagination={{
        itemCount: data?.totalItems || 0,
        pageSize: data?.pageSize || 10,
        pageCount: data?.totalPages || -1,
        pageIndex: data?.pageIndex || 0,
        gotoPage: goToPage
      }}
    />
  )
}

export default ResourceGroupListView
