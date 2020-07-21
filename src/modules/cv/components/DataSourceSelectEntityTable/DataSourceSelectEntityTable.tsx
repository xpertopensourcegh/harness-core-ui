import React, { useMemo, useEffect, useState, useCallback } from 'react'
import { Table, SelectOption, Text } from '@wings-software/uikit'
import css from './DataSourceSelectEntityTable.module.scss'
import type { IHTMLTableProps } from '@blueprintjs/core'
import type { Cell, Column } from 'react-table'

type TableEntityCell = {
  selected: boolean
  entity: SelectOption
  entityName: string
}

interface DataSourceSelectEntityTableProps {
  entityTableColumnName: string
  onSubmit?: (selectedEntities: SelectOption[]) => void
  entityOptions: SelectOption[]
}

interface TableCheckboxProps {
  cell: Cell<TableEntityCell>
  onChange: (isChecked: boolean, index: number) => void
}

const BPTableProps: IHTMLTableProps = {}

function TableCheckbox(props: TableCheckboxProps): JSX.Element {
  const { cell, onChange } = props
  const onChangeCallback = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.currentTarget?.checked, cell?.row?.index),
    [onChange, cell?.row?.index]
  )
  return <input type="checkbox" checked={cell.value} name="selected" onChange={onChangeCallback} />
}

export default function DataSourceSelectEntityTable(props: DataSourceSelectEntityTableProps): JSX.Element {
  const { entityTableColumnName, onSubmit, entityOptions: propsEntityOptions } = props
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
          return <Text>{cell.value}</Text>
        }
      }
    ],
    [entityTableColumnName, onColumnCheckboxCallback, onRowCheckboxCallback]
  )

  useEffect(() => {
    if (propsEntityOptions) {
      setEntityOptions(
        propsEntityOptions.map((option: SelectOption) => ({
          selected: false,
          entity: option,
          entityName: option.label
        }))
      )
    }
  }, [propsEntityOptions])
  useEffect(() => {
    onSubmit?.(entityOptions.filter(({ selected }) => selected).map(({ entity }) => entity))
  }, [entityOptions, onSubmit])
  return <Table columns={tableColumns} bpTableProps={BPTableProps} data={entityOptions} className={css.main} />
}
