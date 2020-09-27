import React, { useMemo, useState } from 'react'
import ReactTimeago from 'react-timeago'
import { Layout, Text, Icon, Color, IconName } from '@wings-software/uikit'
import type { CellProps, Renderer, Column } from 'react-table'
import Table from 'modules/common/components/Table/Table'

import { useListReferredByEntities, EntityReferenceDTO } from 'services/cd-ng'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import { Page } from 'modules/common/exports'
import { getIconByEntityType, getReferredEntityLabelByType } from '../utils/ConnectorUtils'

import i18n from './ReferencedBy.i18n'
import css from './ReferencedBy.module.scss'

interface ReferencedByProps {
  accountId: string
  entityIdentifier: string | undefined
}

const RenderColumnEntity: Renderer<CellProps<EntityReferenceDTO>> = ({ row }) => {
  const data = row.original
  return (
    <Layout.Vertical>
      <Layout.Horizontal>
        <Icon
          name={getIconByEntityType(data.referredByEntityType) as IconName}
          size={16}
          className={css.secretIconCss}
        />
        <Text color={Color.BLACK} padding={{ left: 'small' }}>
          {data.referredByEntityName}
        </Text>
      </Layout.Horizontal>
      <Text color={Color.GREY_400} font={{ size: 'small' }} padding={{ left: 'xxlarge' }} margin={{ left: 'xsmall' }}>
        ({getReferredEntityLabelByType(data.referredByEntityType)})
      </Text>
    </Layout.Vertical>
  )
}

const RenderColumnActivity: Renderer<CellProps<EntityReferenceDTO>> = ({ row }) => {
  const data = row.original
  return (
    <Layout.Horizontal spacing="small">
      {data.createdAt ? <ReactTimeago date={data.createdAt} /> : null}
    </Layout.Horizontal>
  )
}

const ReferencedBy: React.FC<ReferencedByProps> = props => {
  const [page, setPage] = useState(0)
  const { data, loading, refetch } = useListReferredByEntities({
    queryParams: { account: props.accountId, identifier: props.entityIdentifier, page: page, size: 10 }
  })

  const columns: Column<EntityReferenceDTO>[] = useMemo(
    () => [
      {
        Header: i18n.ENTITY,
        accessor: 'referredEntityName',
        width: '33%',
        Cell: RenderColumnEntity
      },
      {
        Header: i18n.ACTIVITY,
        accessor: 'createdAt',
        width: '66%',
        Cell: RenderColumnActivity
      }
    ],
    [refetch]
  )
  return (
    <Layout.Vertical height={'calc(100vh - 64px'}>
      <Layout.Horizontal
        padding={{ top: 'large', bottom: 'large', left: 'large', right: 'large' }}
        height={72}
        border={{ bottom: true, color: Color.GREY_300 }}
        flex={{ distribution: 'space-between' }}
      >
        <Text font={{ size: 'medium' }} color={Color.DARK_600}>
          {i18n.ReferencedBy}
        </Text>

        {/* TODO:  <TextInput
          leftIcon="search"
          placeholder="Search"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchTerm(e.target.value.trim())
            }}
        /> */}
      </Layout.Horizontal>
      {!loading ? (
        data?.data?.content?.length ? (
          <Table<EntityReferenceDTO>
            className={css.table}
            columns={columns}
            data={data.data.content || []}
            pagination={{
              itemCount: data.data.numberOfElements || 0,
              pageSize: data.data.size || 10,
              pageCount: data.data.totalPages || -1,
              pageIndex: data.data.pageable?.pageNumber || 0,
              gotoPage: pageNumber => setPage(pageNumber)
            }}
          />
        ) : (
          <Page.NoDataCard icon="nav-dashboard" message={i18n.noData} />
        )
      ) : (
        <PageSpinner />
      )}
    </Layout.Vertical>
  )
}
export default ReferencedBy
