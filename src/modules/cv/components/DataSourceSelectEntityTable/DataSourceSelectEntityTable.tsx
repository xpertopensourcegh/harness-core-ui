import React, { useMemo, useEffect, useState, useCallback } from 'react'
import { Table, SelectOption, Text } from '@wings-software/uikit'
import * as AppDynamicsService from '../../services/AppDynamicsService'
import * as AppDynamicsOnBoardingUtils from '../../pages/OnBoarding/AppDynamics/AppDynamicsOnboardingUtils'
import xhr from '@wings-software/xhr-async'
import css from './DataSourceSelectEntityTable.module.scss'
import type { IHTMLTableProps } from '@blueprintjs/core'
import type { Cell, Column } from 'react-table'
import type { ResponseWrapper } from 'modules/common/utils/HelperTypes'

type TableEntityCell = {
  selected: boolean
  entity: SelectOption
  entityName: string
}

interface DataSourceSelectEntityTableProps {
  entityTableColumnName: string
  verificationType: string
  datasourceId: string
  accountId: string
  onSubmit?: (selectedEntities: SelectOption[]) => void
}

interface TableCheckboxProps {
  cell: Cell<TableEntityCell>
  onChange: (isChecked: boolean, index: number) => void
}

const XHR_FETCH_ENTITIES_GROUP = 'XHR_FETCH_ENTITIES_GROUP'
const BPTableProps: IHTMLTableProps = {}

function TableCheckbox(props: TableCheckboxProps): JSX.Element {
  const { cell, onChange } = props
  const onChangeCallback = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.currentTarget?.checked, cell?.row?.index),
    [onChange, cell?.row?.index]
  )
  return <input type="checkbox" checked={cell.value} name="selected" onChange={onChangeCallback} />
}

// map to call the appropriate service depending on data source and its corresponding transform function
const VerificationTypeEntityCall: {
  [verificationType: string]: {
    entityFetchFunc: ({
      accountId,
      dataSourceId,
      xhrGroup
    }: {
      accountId: string
      dataSourceId: string
      xhrGroup: string
    }) => Promise<ResponseWrapper<any, 'response'>>
    transformResponseFunc: (response: any) => SelectOption[]
  }
} = {
  'app-dynamics': {
    entityFetchFunc: AppDynamicsService.fetchAppDynamicsApplications,
    transformResponseFunc: AppDynamicsOnBoardingUtils.transformAppDynamicsApplications
  }
}

export default function DataSourceSelectEntityTable(props: DataSourceSelectEntityTableProps): JSX.Element {
  const { entityTableColumnName, verificationType, accountId, datasourceId, onSubmit } = props
  const [isAllChecked, setAllChecked] = useState(false)
  const [entityOptions, setEntityOptions] = useState<TableEntityCell[]>([])
  const onColumnCheckboxCallback = useCallback(() => {
    const checkedData = [...entityOptions]
    checkedData.forEach(entityRow => (entityRow.selected = !isAllChecked))
    setEntityOptions(checkedData)
    setAllChecked(!isAllChecked)
  }, [entityOptions, isAllChecked])
  const onRowCheckboxCallback = useCallback(
    (isSelected: boolean, index: number) => {
      const tableData = [...entityOptions]
      tableData[index].selected = isSelected
      setEntityOptions(tableData)
    },
    [entityOptions]
  )

  const tableColumns: Array<Column<TableEntityCell>> = useMemo(
    () => [
      {
        Header: <input type="checkbox" onClick={onColumnCheckboxCallback} />,
        accessor: 'selected',
        Cell: function TableCheckboxWrapper(cell: Cell<TableEntityCell>) {
          return <TableCheckbox cell={cell} onChange={onRowCheckboxCallback} />
        }
      },
      {
        Header: entityTableColumnName,
        accessor: 'entityName',
        Cell: function EntityName(cell: Cell<TableEntityCell>) {
          return <Text>{cell.value.entityName}</Text>
        }
      }
    ],
    [entityTableColumnName, onColumnCheckboxCallback, onRowCheckboxCallback]
  )

  useEffect(() => {
    onSubmit?.(entityOptions.filter(({ selected }) => selected).map(({ entity }) => entity))
  }, [entityOptions, onSubmit])
  useEffect(() => {
    const { entityFetchFunc, transformResponseFunc } = VerificationTypeEntityCall[verificationType] || {}
    entityFetchFunc?.({
      accountId,
      dataSourceId: datasourceId,
      xhrGroup: XHR_FETCH_ENTITIES_GROUP
    }).then(({ status, error, response }) => {
      if (status === xhr.ABORTED) {
        return
      } else if (error) {
        return
      } else if (response?.resource?.length) {
        setEntityOptions(
          transformResponseFunc?.(response.resource)?.map((option: SelectOption) => ({
            selected: false,
            entity: option,
            entityName: option.label
          }))
        )
      }
    })
  }, [accountId, datasourceId, verificationType])

  return <Table columns={tableColumns} bpTableProps={BPTableProps} data={entityOptions} className={css.main} />
}
