import React from 'react'
import 'regenerator-runtime/runtime'
import {
  useTable,
  usePagination,
  useSortBy,
  HeaderGroup,
  useAsyncDebounce,
  useGlobalFilter,
  TableOptions
} from 'react-table'
import { Text, Color, Button, Icon, Layout, Container, Intent, Tag, TextInput } from '@wings-software/uikit'
import * as moment from 'moment'
import TimeAgo from 'react-timeago'
import cx from 'classnames'
import { Menu, Popover, PopoverInteractionKind, Position } from '@blueprintjs/core'
import i18n from './CustomTable.i18n'
import css from './CustomTable.module.scss'
const formatDate = (timeObj: any, format = 'MM/DD/YYYY hh:mm a') => {
  return timeObj ? moment.unix(timeObj / 1000).format(format) : ''
}

interface Status {
  [key: string]: string
}
interface ViewTypes {
  [key: string]: string
}

const status: Status = {
  ACTIVE: 'active',
  ERROR: 'error'
}

const viewTypes: ViewTypes = {
  LIST: 'list',
  GRID: 'grid'
}

function ViewOptions({ viewType, setViewType }: any) {
  return (
    <Layout.Horizontal spacing="large">
      <Icon
        name="grid-view"
        intent={viewType === viewTypes.GRID ? 'primary' : 'none'}
        onClick={() => setViewType(viewTypes.GRID)}
        style={{ cursor: 'pointer' }}
      />
      <Icon
        name="list"
        intent={viewType === viewTypes.LIST ? 'primary' : 'none'}
        onClick={() => setViewType(viewTypes.LIST)}
        style={{ cursor: 'pointer' }}
      />
    </Layout.Horizontal>
  )
}

function FilterPanel({ openFilterPanel }: any) {
  return (
    <Layout.Horizontal spacing="large">
      <Icon
        name="settings"
        onClick={() => openFilterPanel(true)}
        style={{ cursor: 'pointer', transform: 'rotate(90deg)' }}
      />
    </Layout.Horizontal>
  )
}

function GlobalFilter({ globalFilter, setGlobalFilter }: any) {
  const [value, setValue] = React.useState(globalFilter)
  const [isOpen, setIsOpen] = React.useState(false)
  const onChange = useAsyncDebounce(searchValue => {
    setGlobalFilter(searchValue || undefined)
  }, 200)
  return (
    <TextInput
      leftIcon="search"
      placeholder="Search..."
      className={cx(css.inputSearch, (value || isOpen) && css.openState)}
      value={value || ''}
      onClick={() => setIsOpen(true)}
      onChange={e => {
        const element = e.currentTarget as HTMLInputElement
        const elementValue = element.value
        setValue(elementValue)
        onChange(elementValue)
      }}
      rightElement={
        isOpen &&
        ((
          <Icon
            name="cross"
            margin="none"
            onClick={() => {
              setIsOpen(false)
              setValue('')
              setGlobalFilter(undefined)
            }}
          />
        ) as any)
      }
    />
  )
}

function TagsRenderer({ tags }: any) {
  if (!tags) {
    return null
  }
  const tagsArray = tags.split(',')
  return (
    <Layout.Vertical spacing={'medium'}>
      <Text style={{ fontWeight: 700, color: 'var(--black)' }}>TAGS</Text>
      <Container style={{ marginTop: 'var(--spacing-medium)' }}>
        {tagsArray.length > 0 &&
          tagsArray.map((data: string, index: number) => (
            <Tag
              intent={Intent.PRIMARY}
              minimal={true}
              key={data + index}
              style={{ marginRight: 'var(--spacing-small)', marginBottom: 'var(--spacing-small)', borderRadius: 4 }}
            >
              {data}
            </Tag>
          ))}
      </Container>
    </Layout.Vertical>
  )
}

const Table = ({ columns, data, openFilterPanel, onClickRow, onDeleteRow }: any): JSX.Element => {
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
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 5, hiddenColumns: ['tags', 'url', 'details.url', 'infoText'] }
    } as TableOptions<object>,
    useGlobalFilter,
    useSortBy,
    usePagination
  ) as any
  const [viewType, setViewType] = React.useState(viewTypes.LIST)
  // Render the UI for your table

  return (
    <section className={css.tableWrapper}>
      <Layout.Horizontal flex={true} spacing="xlarge" padding="medium" className={css.filterOptions}>
        <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
        <ViewOptions viewType={viewType} setViewType={setViewType} />
        <FilterPanel openFilterPanel={openFilterPanel} />
      </Layout.Horizontal>
      {page && page.length > 0 && (
        <div className={cx(css.list, viewType === viewTypes.GRID && css.grid)}>
          <table {...getTableProps()}>
            <thead className={css.tableHead}>
              {headerGroups.map((headerGroup: HeaderGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.headers as any}>
                  {headerGroup.headers.map((column: any, index: number) => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column + index}>
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
              {page.map((row: any, k: number) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()} key={row + k} onClick={() => onClickRow(row.original?.identifier)}>
                    {row.cells.map((cell: any, index: any) => {
                      if ((index === 4 || index === 5) && viewType === viewTypes.GRID) {
                        return null
                      }
                      return (
                        <td
                          key={cell + index}
                          {...cell.getCellProps()}
                          align={index === 5 ? 'right' : 'left'}
                          width={index == 3 && viewType === viewTypes.LIST ? 150 : 'auto'}
                        >
                          {index == 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Text
                                inline
                                icon={cell.row.original?.icon}
                                iconProps={{ size: 28 }}
                                style={{ color: 'var(--grey-800)', fontWeight: 700, fontSize: 14 }}
                              >
                                <div style={{ display: 'grid', alignItems: 'center', gridGap: '5px' }}>
                                  <div>
                                    {cell.render('Cell')}
                                    {cell.row.original?.tags?.split(',').length > 0 && (
                                      <Popover
                                        interactionKind={PopoverInteractionKind.HOVER}
                                        popoverClassName={css.tagsPopover}
                                        position={Position.RIGHT}
                                        content={(<TagsRenderer tags={cell.row.original?.tags} />) as JSX.Element}
                                      >
                                        <span>
                                          <Icon
                                            name="main-tags"
                                            size={16}
                                            style={{ marginLeft: 5, paddingBottom: 3 }}
                                          />{' '}
                                          <Text inline style={{ color: 'var(--grey-500)', fontSize: 14 }}>
                                            {cell.row.original?.tags?.split(',').length}
                                          </Text>
                                        </span>
                                      </Popover>
                                    )}
                                  </div>
                                  <Text inline style={{ color: 'var(--grey-400)' }}>
                                    {cell.row.original?.belongsTo}
                                  </Text>
                                </div>
                              </Text>
                              {viewType === viewTypes.GRID && (
                                <Button icon="main-more" intent="primary" minimal className={css.moreIcon} />
                              )}
                            </div>
                          )}
                          {index == 1 && (
                            <Text inline style={{ color: 'var(--grey-800)', fontWeight: 700, fontSize: 14 }}>
                              <Text inline style={{ color: 'var(--grey-800)', fontWeight: 700, fontSize: 14 }}>
                                <div style={{ display: 'grid', alignItems: 'center', gridGap: '5px' }}>
                                  {cell.row.original?.details?.url && (
                                    <span>
                                      URL:{' '}
                                      <a
                                        className={css.externalLink}
                                        href={cell.row.original?.details?.url}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        {cell.row.original?.details?.url}
                                      </a>
                                    </span>
                                  )}
                                  {cell.row.original?.details?.accessKey && (
                                    <span>KEY: {cell.row.original?.details?.accessKey}</span>
                                  )}
                                  <Text inline style={{ color: 'var(--grey-400)' }}>
                                    <span>{cell.row.original?.details?.description}</span>
                                  </Text>
                                </div>
                              </Text>
                            </Text>
                          )}
                          {index == 2 && (
                            <section>
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
                            </section>
                          )}
                          {index == 3 && (
                            <section style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                              {viewType === viewTypes.GRID && cell.row.original?.status === 'ERROR' && (
                                <Button
                                  text="Retry"
                                  intent="primary"
                                  minimal
                                  style={{
                                    textTransform: 'uppercase',
                                    border: '1px solid var(--blue-500)',
                                    borderRadius: 8
                                  }}
                                />
                              )}
                            </section>
                          )}
                          {index == 4 && viewType === viewTypes.LIST && cell.row.original?.status === 'ERROR' && (
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
                          {index == 5 && viewType === viewTypes.LIST && (
                            <Popover
                              minimal
                              position={Position.BOTTOM_RIGHT}
                              interactionKind={PopoverInteractionKind.HOVER}
                              content={
                                <Menu className={css.crud}>
                                  <Menu.Item
                                    onClick={() => onClickRow(cell.row.original?.identifier)}
                                    key={index}
                                    text={'Edit'}
                                    icon="edit"
                                  />
                                  <Menu.Item
                                    onClick={() => onDeleteRow(cell.row.original?.identifier)}
                                    key={index}
                                    text={'Delete'}
                                    icon="trash"
                                  />{' '}
                                </Menu>
                              }
                            >
                              <Button icon="main-more" intent="primary" minimal className={css.moreIcon} />
                            </Popover>
                          )}
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
      )}
      {page && page.length > 0 && (
        <Layout.Horizontal
          flex={true}
          style={{
            borderTop: '1px solid var(--grey-200)',
            paddingTop: 'var(--spacing-medium)',
            paddingBottom: 'var(--spacing-medium)'
          }}
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
      )}
      {page && page.length === 0 && (
        <Layout.Vertical flex={true}>
          <Text style={{ color: 'var(--color-800)', fontSize: 16, marginTop: '300px' }}>{i18n.noResultText}</Text>
        </Layout.Vertical>
      )}
    </section>
  )
}
class CustomTable extends React.Component<{
  data: any
  columns: any
  openFilterPanel?: any
  onClickRow?: any
  onDeleteRow?: any
}> {
  render() {
    return (
      <Table
        columns={this.props.columns}
        data={this.props.data}
        openFilterPanel={this.props.openFilterPanel}
        onClickRow={this.props.onClickRow}
        onDeleteRow={this.props.onDeleteRow}
      />
    )
  }
}

export default CustomTable
