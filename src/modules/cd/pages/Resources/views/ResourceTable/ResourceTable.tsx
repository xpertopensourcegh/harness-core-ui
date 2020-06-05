import React from 'react'

import { useTable, usePagination, useSortBy, TableInstance } from 'react-table'
import { Text, Color, Button, Icon, Layout } from '@wings-software/uikit'
import css from './ResourceTable.module.scss'
import * as moment from 'moment'
import TimeAgo from 'react-timeago'

const formatDate = (timeObj: any, format = 'MM/DD/YYYY hh:mm a') => {
  return timeObj ? moment.unix(timeObj / 1000).format(format) : ''
}

interface Status {
  [key: string]: string
}

const status: Status = {
  ACTIVE: 'active',
  ERROR: 'error'
}

function Table({ columns, data }: TableInstance) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 5 }
    },

    useSortBy,
    usePagination
  )
  // Render the UI for your table
  return (
    <section className={css.tableWrapper}>
      <div>
        <table {...getTableProps()}>
          <thead className={css.tableHead}>
            {headerGroups.map((headerGroup: any) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup?.headers}>
                {headerGroup.headers.map((column: any) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column}>
                    {column.render('Header')}
                    <span style={{ display: 'inline-flex', marginLeft: 5 }}>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <Icon name="main-caret-down" size={8} />
                        ) : (
                          <Icon name="main-caret-up" size={8} />
                        )
                      ) : (
                        ''
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row: any) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} key={row}>
                  {row.cells.map((cell: any, index: any) => {
                    return (
                      <td
                        key={cell}
                        {...cell.getCellProps()}
                        align={index === 5 ? 'right' : 'left'}
                        width={index == 3 ? 150 : 'auto'}
                      >
                        {index == 0 && (
                          <Text
                            inline
                            icon={cell.row.original?.icon}
                            iconProps={{ size: 42 }}
                            style={{ color: 'var(--grey-800)', fontWeight: 700, fontSize: 16 }}
                          >
                            <div style={{ display: 'grid', alignItems: 'center', gridGap: '5px' }}>
                              <span>{cell.render('Cell')}</span>
                              <Text inline style={{ color: 'var(--grey-400)' }}>
                                {cell.row.original?.infoText}
                              </Text>
                            </div>
                          </Text>
                        )}
                        {index == 1 && (
                          <Text inline style={{ color: 'var(--grey-800)', fontWeight: 700, fontSize: 16 }}>
                            <Text inline style={{ color: 'var(--grey-800)', fontWeight: 700, fontSize: 16 }}>
                              <div style={{ display: 'grid', alignItems: 'center', gridGap: '5px' }}>
                                <span>{cell.row.original?.details?.url}</span>
                                <span>{cell.row.original?.details?.accessKey}</span>
                                <Text inline style={{ color: 'var(--grey-400)' }}>
                                  <span>{cell.row.original?.details?.description}</span>
                                </Text>
                              </div>
                            </Text>
                          </Text>
                        )}
                        {index == 2 && (
                          <Text
                            inline
                            style={{ color: 'var(--grey-800)', fontSize: 16 }}
                            icon="pulse"
                            iconProps={{
                              style: {
                                background: 'var(--blue-700)',
                                padding: 5,
                                borderRadius: 20,
                                color: 'white',
                                marginRight: 5
                              },
                              size: 10
                            }}
                          >
                            <div style={{ display: 'grid', alignItems: 'center', gridGap: '5px' }}>
                              {/* <span>{cell.row.original?.lastActivityText}</span> */}
                              <Text inline style={{ color: 'var(--grey-700)' }}>
                                <TimeAgo
                                  date={cell.row.original?.lastActivityTime}
                                  title={formatDate(cell.row.original?.lastActivityTime)}
                                  minPeriod={30}
                                  data-value={cell.row.original?.lastActivityTime}
                                />
                              </Text>
                            </div>
                          </Text>
                        )}
                        {index == 3 && (
                          <Text
                            inline
                            icon={cell.row.original?.status === 'ACTIVE' ? 'full-circle' : 'warning-sign'}
                            iconProps={{
                              size: cell.row.original?.status === 'ACTIVE' ? 10 : 16,
                              style: { marginTop: cell.row.original?.status === 'ACTIVE' ? 5 : 3 },
                              color: cell.row.original?.status === 'ACTIVE' ? Color.GREEN_500 : Color.RED_500
                            }}
                            style={{ color: 'var(--grey-800)', fontWeight: 700, fontSize: 16 }}
                          >
                            <div style={{ display: 'grid', alignItems: 'center', gridGap: '5px' }}>
                              <span>{status[cell.row.original?.status]}</span>
                              <Text inline style={{ color: 'var(--grey-400)' }}>
                                <TimeAgo
                                  date={cell.row.original?.statusTime}
                                  title={formatDate(cell.row.original?.statusTime)}
                                  minPeriod={30}
                                  data-value={cell.row.original?.statusTime}
                                />
                              </Text>
                            </div>
                          </Text>
                        )}
                        {index == 4 && cell.row.original?.status === 'ERROR' && (
                          <Button
                            text="Test Connection"
                            intent="primary"
                            minimal
                            style={{
                              textTransform: 'uppercase',
                              border: '1px solid var(--blue-500)',
                              borderRadius: 8
                            }}
                          />
                        )}
                        {index == 5 && <Button icon="main-more" intent="primary" minimal className={css.moreIcon} />}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      </div>
      <Layout.Horizontal
        flex={true}
        style={{ borderTop: '1px solid var(--grey-200)', paddingTop: 'var(--spacing-medium)' }}
      >
        <Text inline style={{ color: 'var(--grey-400)', fontSize: 16 }}>
          Showing &nbsp;
          <Text inline style={{ color: 'var(--grey-900)', fontSize: 16 }}>
            <strong>
              {pageSize * pageIndex + 1} - {pageSize * pageIndex + pageSize}
            </strong>{' '}
            of <strong>{pageOptions.length * pageSize}</strong>
          </Text>
        </Text>
        <div className="pagination">
          <Button
            minimal
            icon="double-chevron-left"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            style={{ marginRight: 'var(--spacing-medium)' }}
          />

          <Button
            minimal
            icon="chevron-left"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            style={{ marginRight: 'var(--spacing-medium)' }}
          />

          <Button
            minimal
            icon="chevron-right"
            onClick={() => nextPage()}
            disabled={!canNextPage}
            style={{ marginRight: 'var(--spacing-medium)' }}
          />

          <Button
            minimal
            icon="double-chevron-right"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            style={{ marginRight: 'var(--spacing-medium)' }}
          />

          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[5, 10, 20, 30, 40].map(pageSizeNo => (
              <option key={pageSizeNo} value={pageSizeNo}>
                Show {pageSizeNo}
              </option>
            ))}
          </select>
        </div>
      </Layout.Horizontal>
    </section>
  )
}
const ResourceTable: React.FC = (props: any) => {
  return <Table columns={props?.columns} data={props?.data} />
}

export default ResourceTable
