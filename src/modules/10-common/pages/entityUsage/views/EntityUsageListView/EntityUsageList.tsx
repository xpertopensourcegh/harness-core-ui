import React, { useMemo } from 'react'
import ReactTimeago from 'react-timeago'
import type { Column, Renderer, CellProps } from 'react-table'
import { Text, Color, Layout } from '@wings-software/uicore'

import Table from '@common/components/Table/Table'
import type { EntitySetupUsageDTO, ResponsePageEntitySetupUsageDTO } from 'services/cd-ng'
import { useStrings } from 'framework/strings'
import ResourceDetailFactory from '@common/factories/ResourceDetailFactory'
import css from './EntityUsageList.module.scss'

interface EntityUsageListProps {
  entityData: ResponsePageEntitySetupUsageDTO | null
  gotoPage: (pageNumber: number) => void
}

const RenderColumnEntity: Renderer<CellProps<EntitySetupUsageDTO>> = ({ row }) => {
  const data = row.original
  const checkReferredByEntityTypeHandler = ResourceDetailFactory.getReferredByEntityTypeHandler(
    data.referredByEntity.type
  )
  if (checkReferredByEntityTypeHandler)
    return checkReferredByEntityTypeHandler.getResourceDetailViewAndAction({ referredByEntity: data.referredByEntity })
  else
    return (
      <Layout.Vertical>
        <Layout.Horizontal>
          <Text color={Color.BLACK} lineClamp={1} className={css.overflow}>
            {data.referredByEntity?.name}
          </Text>
        </Layout.Horizontal>
        <Text color={Color.GREY_400} lineClamp={1} className={css.overflow}>
          {data.referredByEntity?.type}
        </Text>
      </Layout.Vertical>
    )
}
const RenderColumnDetail: Renderer<CellProps<EntitySetupUsageDTO>> = ({ row }) => {
  const data = row.original
  const chkReferredEntityDetailHandler = ResourceDetailFactory.getReferredEntityUsageDetailTypeHandler(
    data.detail?.type
  )
  if (chkReferredEntityDetailHandler)
    return chkReferredEntityDetailHandler.getResourceDetailViewAndAction({
      referredEntity: data.referredEntity,
      referredByEntity: data.referredByEntity,
      detail: data.detail
    })
  else return null
}

const RenderColumnActivity: Renderer<CellProps<EntitySetupUsageDTO>> = ({ row }) => {
  const data = row.original
  return (
    <Layout.Horizontal spacing="small">
      {data.createdAt ? <ReactTimeago date={data.createdAt} /> : null}
    </Layout.Horizontal>
  )
}

const EntityUsageList: React.FC<EntityUsageListProps> = ({ entityData, gotoPage }) => {
  const data: EntitySetupUsageDTO[] = entityData?.data?.content || []
  const { getString } = useStrings()
  const columns: Column<EntitySetupUsageDTO>[] = useMemo(
    () => [
      {
        Header: getString('entity'),
        accessor: 'referredByEntity',
        width: '33%',
        Cell: RenderColumnEntity
      },
      {
        Header: getString('details'),
        accessor: 'detail',
        width: '33%',
        Cell: RenderColumnDetail
      },
      {
        Header: getString('lastActivity'),
        accessor: 'createdAt',
        width: '34%',
        Cell: RenderColumnActivity
      }
    ],
    [data]
  )

  return (
    <Table<EntitySetupUsageDTO>
      className={css.table}
      columns={columns}
      data={data}
      pagination={{
        itemCount: entityData?.data?.totalElements || 0,
        pageSize: entityData?.data?.size || 10,
        pageCount: entityData?.data?.totalPages || 0,
        pageIndex: entityData?.data?.pageable?.pageNumber || 0,
        gotoPage
      }}
    />
  )
}

export default EntityUsageList
