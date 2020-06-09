import React, { useState, useMemo } from 'react'
import { Table, Container, Text, Link, Checkbox } from '@wings-software/uikit'
import type { Column, Cell } from 'react-table'
import type { IHTMLTableProps } from '@blueprintjs/core'

export type SelectedMetric = { included: boolean; metric: string }

interface TableWithCheckColumnsProps {
  columns: Column[]
  metrics: SelectedMetric[]
  metricPackName: string
  onChange?: (selectedMetrics: SelectedMetric[]) => void
}

const BPTableProps: IHTMLTableProps = {
  interactive: false
}

export function MetricPackTable(props: TableWithCheckColumnsProps): JSX.Element {
  const { metrics, onChange, metricPackName } = props
  const [tableData, setTableData] = useState<SelectedMetric[]>(metrics)

  const columnHeaders: Array<Column<{ included: boolean; metric: string }>> = useMemo(
    () => [
      {
        Header: '',
        accessor: 'included',
        Cell: function checkbox(cell: Cell) {
          return (
            <Checkbox
              checked={cell.value}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                const newTableData = [...tableData]
                newTableData[cell.row.index].included = e.currentTarget.checked
                setTableData(newTableData)
                onChange?.(newTableData)
              }}
            />
          )
        }
      },
      {
        Header: '',
        accessor: 'metric'
      }
    ],
    [tableData, onChange]
  )

  return (
    <Container>
      <Container>
        <Text>{metricPackName}</Text>
        <Link withoutHref>Edit</Link>
      </Container>
      <Table columns={columnHeaders} bpTableProps={BPTableProps} data={tableData} />
    </Container>
  )
}
