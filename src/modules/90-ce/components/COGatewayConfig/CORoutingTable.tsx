import React from 'react'
import { Select, Table, TextInput } from '@wings-software/uicore'
import type { CellProps } from 'react-table'
import debounce from 'lodash-es/debounce'
import { useCallback } from 'react'
import type { PortConfig } from 'services/lw'
import type { InstanceDetails } from '../COCreateGateway/models'
import css from './COGatewayConfig.module.scss'

interface SelectItem {
  label: string
  value: string
}

const protocols: SelectItem[] = [
  {
    label: 'http',
    value: 'http'
  },
  {
    label: 'https',
    value: 'https'
  }
]

const actions: SelectItem[] = [
  {
    label: 'Redirecrt',
    value: 'redirect'
  },
  {
    label: 'Forward',
    value: 'forward'
  }
]

interface CORoutingTableProps {
  routingRecords: PortConfig[]
  setRoutingRecords: (records: PortConfig[]) => void
}
const CORoutingTable: React.FC<CORoutingTableProps> = props => {
  function updatePortConfig(index: number, column: string, val: string) {
    const portConfig = [...props.routingRecords]
    switch (column) {
      case 'protocol': {
        portConfig[index]['protocol'] = val
        break
      }
      case 'target_protocol': {
        portConfig[index]['target_protocol'] = val
        break
      }
      case 'action': {
        portConfig[index]['action'] = 'forward' //todo:fix
        break
      }
      case 'redirect_url': {
        portConfig[index]['redirect_url'] = val
        break
      }
      case 'server_name': {
        portConfig[index]['server_name'] = val
        break
      }
      case 'routing_rules': {
        portConfig[index]['routing_rules'] = [{ path_match: val }] // eslint-disable-line
        break
      }
      case 'port': {
        portConfig[index]['port'] = +val
        break
      }
      case 'target_port': {
        portConfig[index]['target_port'] = +val
        break
      }
    }
    props.setRoutingRecords(portConfig)
  }
  const updateInput = useCallback(debounce(updatePortConfig, 1000), [])
  function getItembyValue(items: SelectItem[], value: string): SelectItem {
    return items.filter(x => x.value == value)[0]
  }
  function InputCell(tableProps: CellProps<InstanceDetails>): JSX.Element {
    return (
      <TextInput
        defaultValue={tableProps.value}
        style={{ border: 'none' }}
        onChange={e => {
          const value = (e.currentTarget as HTMLInputElement).value
          updateInput(tableProps.row.index, tableProps.column.id, value)
        }}
      />
    )
  }
  function ProtocolCell(tableProps: CellProps<InstanceDetails>): JSX.Element {
    return (
      <Select
        className={css.selectCell}
        value={getItembyValue(protocols, tableProps.value)}
        items={protocols}
        onChange={e => {
          updatePortConfig(tableProps.row.index, tableProps.column.id, e.value.toString())
        }}
      />
    )
  }
  function ActionCell(tableProps: CellProps<InstanceDetails>): JSX.Element {
    return (
      <Select
        className={css.selectCell}
        value={getItembyValue(actions, tableProps.value)}
        items={actions}
        onChange={e => {
          updatePortConfig(tableProps.row.index, tableProps.column.id, e.value.toString())
        }}
      />
    )
  }
  function PathCell(tableProps: CellProps<InstanceDetails>): JSX.Element {
    return (
      <TextInput
        defaultValue={tableProps.value.length ? tableProps.value[0].path_match : ''}
        style={{ border: 'none' }}
        onChange={e => {
          const value = (e.currentTarget as HTMLInputElement).value
          updateInput(tableProps.row.index, tableProps.column.id, value)
        }}
      />
    )
  }
  return (
    <Table<PortConfig>
      data={props.routingRecords}
      className={css.routingTable}
      bpTableProps={{}}
      columns={[
        {
          accessor: 'protocol',
          Header: 'LISTEN PROTOCOL',
          width: '16.5%',
          Cell: ProtocolCell
        },
        {
          accessor: 'port',
          Header: 'LISTON PORT',
          width: '16.5%',
          Cell: InputCell,
          disableSortBy: true
        },
        {
          accessor: 'action',
          Header: 'ACTION',
          width: '16.5%',
          Cell: ActionCell
        },
        {
          accessor: 'target_protocol',
          Header: 'TARGET PROTOCOL',
          width: '16.5%',
          Cell: ProtocolCell
        },
        {
          accessor: 'target_port',
          Header: 'TARGET PORT',
          width: '16.5%',
          Cell: InputCell
        },
        {
          accessor: 'redirect_url',
          Header: 'REDIRECT URL',
          width: '16.5%',
          Cell: InputCell
        },
        {
          accessor: 'server_name',
          Header: 'SERVER NAME',
          width: '16.5%',
          Cell: InputCell
        },
        {
          accessor: 'routing_rules',
          Header: 'PATH MATCH',
          width: '16.5%',
          Cell: PathCell
        }
      ]}
    />
  )
}

export default CORoutingTable
