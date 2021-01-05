import React, { useMemo, useEffect, useState, useCallback } from 'react'
import { Table, SelectOption, Text, Container, ExpandingSearchInput } from '@wings-software/uicore'
import type { IHTMLTableProps } from '@blueprintjs/core'
import type { Cell, Column } from 'react-table'
import css from './DataSourceSelectEntityTable.module.scss'

type TableEntityCell = {
  selected: boolean
  entity: SelectOption
  entityName: string
}

interface DataSourceSelectEntityTableProps {
  entityTableColumnName: string
  onSubmit?: (selectedEntities: SelectOption[]) => void
  entityOptions: SelectOption[]
  onSelectEntity?: (selectedOptions: TableEntityCell[], ttlSelected: number) => void
}

interface TableCheckboxProps {
  cell: Cell<TableEntityCell>
  onChange: (rowVal: TableEntityCell) => void
}

const BPTableProps: IHTMLTableProps = {}

function TableCheckbox(props: TableCheckboxProps): JSX.Element {
  const { cell, onChange } = props
  const onChangeCallback = useCallback(() => onChange(cell.row.original), [onChange, cell.row.original])
  return <input type="checkbox" checked={cell.value} name="selected" onChange={onChangeCallback} />
}

export default function DataSourceSelectEntityTable(props: DataSourceSelectEntityTableProps): JSX.Element {
  const { entityTableColumnName, onSubmit, entityOptions: propsEntityOptions, onSelectEntity } = props
  const [isAllChecked, setAllChecked] = useState(false)
  const [ttlChecked, setTtlChecked] = useState<number>(0)
  const [entityOptions, setEntityOptions] = useState<TableEntityCell[]>([])
  const [appliedFilter, setFilter] = useState<string | undefined>()

  const onColumnCheckboxCallback = useCallback(() => {
    const checkedData = [...entityOptions]
    checkedData.forEach(entityRow => (entityRow.selected = !isAllChecked))
    const newSelectedTotal = isAllChecked ? 0 : checkedData.length
    setEntityOptions(checkedData)
    setAllChecked(!isAllChecked)
    setTtlChecked(newSelectedTotal)
    onSelectEntity?.(checkedData, newSelectedTotal)
  }, [entityOptions, isAllChecked, ttlChecked])

  const onRowCheckboxCallback = useCallback(
    (rowVal: TableEntityCell) => {
      const tableData = [...entityOptions]
      const checkEntity = tableData.find(entity => entity.entityName === rowVal.entityName)
      if (checkEntity) {
        checkEntity.selected = !checkEntity.selected
        const newSelectedTotal = checkEntity.selected ? ttlChecked + 1 : ttlChecked - 1
        setTtlChecked(newSelectedTotal)
        onSelectEntity?.([checkEntity], newSelectedTotal)
      }
      setEntityOptions(tableData)
    },
    [entityOptions, ttlChecked]
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
        Header: (
          <Container flex>
            <Text>{entityTableColumnName}</Text>
            <ExpandingSearchInput className={css.searchBox} onChange={filter => setFilter(filter)} />
          </Container>
        ),
        accessor: 'entityName',
        Cell: function EntityName(cell: Cell<TableEntityCell>) {
          return <Text onClick={() => onRowCheckboxCallback(cell.row.original)}>{cell.value}</Text>
        }
      }
    ],
    [entityTableColumnName, onColumnCheckboxCallback, onRowCheckboxCallback]
  )

  const filteredOptions: TableEntityCell[] = useMemo(() => {
    if (!appliedFilter || !appliedFilter.length) {
      return entityOptions
    }
    const regex = new RegExp(appliedFilter, 'i')
    return entityOptions.filter(({ entityName }) => regex.test(entityName))
  }, [appliedFilter, entityOptions])

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

  return <Table columns={tableColumns} bpTableProps={BPTableProps} data={filteredOptions} className={css.main} />
}
