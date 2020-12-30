import React from 'react'
import type { CellProps } from 'react-table'
import { Table, Text, Color, Layout, Container, Button } from '@wings-software/uikit'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import routes from '@common/RouteDefinitions'
import { Service, useGetServices } from 'services/lw'
type GatewayData = {
  name: string
  hostName: string
  idleTime: string
  state: string
  savingsMTD: string
  savingsPerc: string
  createdAt: string
}
function TableCell(tableProps: CellProps<GatewayData>): JSX.Element {
  return (
    <Text lineClamp={3} color={Color.BLACK}>
      {tableProps.value}
    </Text>
  )
}
const COGatewayList: React.FC = () => {
  const history = useHistory()
  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  const orgID = orgIdentifier
  const { data } = useGetServices({
    org_id: orgID, // eslint-disable-line
    project_id: projectIdentifier // eslint-disable-line
  })
  return (
    <Container width="80%" style={{ margin: '0 auto', paddingTop: 10 }}>
      <Layout.Vertical>
        <Table<Service>
          data={data?.response ? data.response : []}
          bpTableProps={{}}
          columns={[
            {
              accessor: 'name',
              Header: 'Name',
              width: '16.5%',
              Cell: TableCell
            },
            {
              accessor: 'host_name',
              Header: 'Host Name',
              width: '16.5%',
              Cell: TableCell,
              disableSortBy: true
            },
            {
              accessor: 'idle_time_mins',
              Header: 'Idle Time',
              width: '16.5%',
              Cell: TableCell
            },
            {
              accessor: 'fulfilment',
              Header: 'FulFilment',
              width: '16.5%',
              Cell: TableCell
            }
          ]}
        />
        <Layout.Horizontal spacing="medium">
          <Button
            text="Create Gateway"
            icon="plus"
            onClick={() =>
              history.push(
                routes.toCECOCreateGateway({
                  orgIdentifier: orgIdentifier as string,
                  projectIdentifier: projectIdentifier as string,
                  accountId
                })
              )
            }
          />
        </Layout.Horizontal>
      </Layout.Vertical>
    </Container>
  )
}

export default COGatewayList
