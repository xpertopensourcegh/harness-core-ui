/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { useMemo } from 'react'
import { Container, FontVariation, TableV2, Text, Color } from '@harness/uicore'
import type { CellProps, Column, Renderer } from 'react-table'
import moment from 'moment'
import type { BusinessMapping } from 'services/ce'
import { useStrings } from 'framework/strings'
import MenuCell from './MenuCell'

interface BusinessMappingListProps {
  data: BusinessMapping[]
  handleDelete: (id: string, name: string) => void
  onEdit: (data: BusinessMapping) => void
}

const BusinessMappingList: (props: BusinessMappingListProps) => React.ReactElement = ({
  data,
  handleDelete,
  onEdit
}) => {
  const { getString } = useStrings()

  const CostBucketCell: Renderer<CellProps<BusinessMapping>> = cell => {
    return <Text>{cell.value?.length || 0}</Text>
  }

  const NameCell: Renderer<CellProps<BusinessMapping>> = cell => {
    return (
      <Text color={Color.BLACK} font={{ variation: FontVariation.BODY2 }}>
        {cell.value}
      </Text>
    )
  }

  const UserCell: Renderer<CellProps<BusinessMapping>> = cell => {
    return <Text>{cell.value?.name || ''}</Text>
  }

  const LastEditCell: Renderer<CellProps<BusinessMapping>> = cell => {
    return <Text>{moment.utc(cell.value).format('D MMM, HH:mm')}</Text>
  }

  const MenuOptionsCell: Renderer<CellProps<BusinessMapping>> = ({ row }) => {
    const bmId = row.original.uuid as string
    const bmName = row.original.name as string
    const bmData = row.original

    const handleEdit: () => void = () => {
      onEdit(bmData)
    }

    const onDelete: () => void = () => {
      handleDelete(bmId, bmName)
    }

    return <MenuCell id={bmId} name={bmName} handleDelete={onDelete} handleEdit={handleEdit} />
  }

  const columns: Column<BusinessMapping>[] = useMemo(
    () => [
      {
        accessor: 'name',
        Header: getString('name'),
        width: '25%',
        cell: NameCell
      },
      {
        accessor: 'costTargets',
        Header: getString('ce.businessMapping.tableHeadings.costBuckets'),
        Cell: CostBucketCell,
        width: '15%'
      },
      {
        accessor: 'sharedCosts',
        Header: getString('ce.businessMapping.tableHeadings.sharedCosts'),
        Cell: CostBucketCell,
        width: '15%'
      },
      {
        accessor: 'createdBy',
        Header: getString('ce.businessMapping.tableHeadings.createdBy'),
        width: '25%',
        Cell: UserCell
      },
      {
        accessor: 'lastUpdatedAt',
        Header: getString('ce.businessMapping.tableHeadings.lastEdit'),
        Cell: LastEditCell,
        width: '15%'
      },
      {
        Header: ' ',
        width: '5%',
        Cell: MenuOptionsCell
      }
    ],
    []
  )

  return (
    <Container
      margin={{
        top: 'medium'
      }}
    >
      <TableV2<BusinessMapping> columns={columns} data={data} />
    </Container>
  )
}

export default BusinessMappingList