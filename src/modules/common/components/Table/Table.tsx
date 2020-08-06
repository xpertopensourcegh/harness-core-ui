import React from 'react'
import { useTable, Column, useSortBy } from 'react-table'
import cx from 'classnames'
import { Icon } from '@wings-software/uikit'

import css from './Table.module.scss'

interface TableProps<Data extends object> {
  columns: Column<Data>[]
  data: Data[]
  className?: string
  sortable?: boolean
  onRowClick?: (data: Data, index: number) => void
}

const Table = <Data extends object>(props: TableProps<Data>): React.ReactElement => {
  const { columns, data, className, sortable = true } = props
  const { headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data
    },
    useSortBy
  )

  return (
    <div className={cx(css.table, className)}>
      {headerGroups.map(headerGroup => {
        return (
          // react key is not needed since it's generated/added by `react-table`
          // via the getHeaderGroupProps() function
          // eslint-disable-next-line react/jsx-key
          <div {...headerGroup.getHeaderGroupProps()} className={cx(css.header)}>
            {headerGroup.headers.map(header => {
              return (
                // eslint-disable-next-line react/jsx-key
                <div
                  {...header.getHeaderProps(sortable ? header.getSortByToggleProps() : void 0)}
                  className={css.cell}
                  style={{ width: header.width }}
                >
                  {header.render('Header')}
                  {sortable && header.canSort ? (
                    <Icon
                      name={
                        header.isSorted ? (header.isSortedDesc ? 'caret-up' : 'caret-down') : 'double-caret-vertical'
                      }
                      size={15}
                      padding={{ left: 'small' }}
                    />
                  ) : null}
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
          <div
            {...row.getRowProps()}
            className={cx(css.row, css.card, { [css.clickable]: !!props.onRowClick })}
            onClick={() => {
              props.onRowClick?.(row.original, row.index)
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
          </div>
        )
      })}
    </div>
  )
}

export default Table
