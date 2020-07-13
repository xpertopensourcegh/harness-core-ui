import React from 'react'
import { useTable, Column } from 'react-table'
import cx from 'classnames'

import { Card } from '@wings-software/uikit'

import css from './Table.module.scss'

interface TableProps<Data extends object> {
  columns: Column<Data>[]
  data: Data[]
  className?: string
  onRowClick?: (index: number, data: Data) => void
}

const Table = <Data extends object>(props: TableProps<Data>): React.ReactElement => {
  const { columns, data, className } = props
  const { headerGroups, rows, prepareRow } = useTable({
    columns,
    data
  })

  return (
    <div className={cx(css.table, className)}>
      {headerGroups.map(headerGroup => {
        return (
          // react key is not needed since it's generated/added by `react-table`
          // via the getHeaderGroupProps() function
          // eslint-disable-next-line react/jsx-key
          <div {...headerGroup.getHeaderGroupProps()} className={cx(css.row, css.header)}>
            {headerGroup.headers.map(header => {
              return (
                // eslint-disable-next-line react/jsx-key
                <div {...header.getHeaderProps()} className={css.cell} style={{ width: header.width }}>
                  {header.render('Header')}
                </div>
              )
            })}
          </div>
        )
      })}

      {rows.map(row => {
        prepareRow(row)
        return (
          // eslint-disable-next-line react/jsx-key
          <Card
            {...row.getRowProps()}
            className={cx(css.row, css.card)}
            onClick={() => {
              props.onRowClick?.(row.index, row.original)
            }}
          >
            {row.cells.map((cell, index) => {
              return (
                // eslint-disable-next-line react/jsx-key
                <div
                  {...cell.getCellProps()}
                  className={css.cell}
                  style={{ width: headerGroups[0].headers[index].width }}
                >
                  {cell.render('Cell')}
                </div>
              )
            })}
          </Card>
        )
      })}
    </div>
  )
}

export default Table
