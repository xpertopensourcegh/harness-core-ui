import React from 'react'
import type { CellProps } from 'react-table'

import { Text, Table, Color, Container, ExpandingSearchInput, Layout, Checkbox } from '@wings-software/uicore'
import type { GatewayDetails, InstanceDetails } from '@ce/components/COCreateGateway/models'
import i18n from './COInstanceSelector.i18n'
import css from './COInstanceSelector.module.scss'

interface COInstanceSelectorprops {
  instances: InstanceDetails[]
  selectedInstances: InstanceDetails[]
  setSelectedInstances: (selectedInstances: InstanceDetails[]) => void
  search: (t: string) => void
  setGatewayDetails: (gatewayDetails: GatewayDetails) => void
  gatewayDetails: GatewayDetails
}

function TableCell(tableProps: CellProps<InstanceDetails>): JSX.Element {
  return (
    <Text lineClamp={3} color={Color.BLACK}>
      {tableProps.value}
    </Text>
  )
}
function NameCell(tableProps: CellProps<InstanceDetails>): JSX.Element {
  return (
    <Text lineClamp={3} color={Color.BLACK}>
      {tableProps.value} {tableProps.row.original.id}
    </Text>
  )
}

const COInstanceSelector: React.FC<COInstanceSelectorprops> = props => {
  const selectedInstances: InstanceDetails[] = props.selectedInstances
  const instances: InstanceDetails[] = props.instances
  function TableCheck(tableProps: CellProps<InstanceDetails>): JSX.Element {
    return (
      <Checkbox
        checked={isSelectedInstance(tableProps.row.original)}
        onChange={e => {
          if (e.currentTarget.checked && !isSelectedInstance(tableProps.row.original)) {
            selectedInstances.push(tableProps.row.original)
          } else if (!e.currentTarget.checked && isSelectedInstance(tableProps.row.original)) {
            selectedInstances.splice(selectedInstances.indexOf(tableProps.row.original), 1)
          }
          const newInstances = [...selectedInstances]
          props.setSelectedInstances(newInstances)
          props.gatewayDetails.selectedInstances = newInstances
          props.setGatewayDetails(props.gatewayDetails)
        }}
      />
    )
  }
  function isSelectedInstance(item: InstanceDetails): boolean {
    return selectedInstances.findIndex(s => s.id == item.id) >= 0 ? true : false
  }
  return (
    <Container>
      <Layout.Vertical spacing="large">
        <ExpandingSearchInput className={css.search} onChange={(text: string) => props.search(text)} />
        <Container style={{ maxWidth: '776px' }}>
          <Table
            data={instances}
            bpTableProps={{}}
            columns={[
              {
                Header: '',
                id: 'selected',
                Cell: TableCheck
              },
              {
                accessor: 'name',
                Header: i18n.name,
                width: '16.5%',
                Cell: NameCell
              },
              {
                accessor: 'ipv4',
                Header: i18n.ipAddress,
                width: '16.5%',
                Cell: TableCell,
                disableSortBy: true
              },
              {
                accessor: 'region',
                Header: i18n.region,
                width: '16.5%',
                Cell: TableCell
              },
              {
                accessor: 'type',
                Header: i18n.type,
                width: '16.5%',
                Cell: TableCell
              },
              {
                accessor: 'tags',
                Header: i18n.tags,
                width: '16.5%',
                Cell: TableCell
              },
              {
                accessor: 'launch_time',
                Header: i18n.launchTime,
                width: '16.5%',
                Cell: TableCell
              },
              {
                accessor: 'status',
                Header: i18n.status,
                width: '16.5%',
                Cell: TableCell
              }
            ]}
          />
        </Container>
      </Layout.Vertical>
    </Container>
  )
}

export default COInstanceSelector
