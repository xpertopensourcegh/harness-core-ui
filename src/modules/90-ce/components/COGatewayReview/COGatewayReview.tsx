import React from 'react'
import type { CellProps } from 'react-table'
import { Heading, Container, Layout, Label, Text, Table, Color, Icon, IconName } from '@wings-software/uicore'
import type { GatewayDetails, InstanceDetails } from '@ce/components/COCreateGateway/models'
import type { PortConfig } from 'services/lw'
import i18n from './COGatewayReview.i18n'
import css from './COGatewayReview.module.scss'
interface COGatewayReviewProps {
  gatewayDetails: GatewayDetails
}

function TableCell(tableProps: CellProps<InstanceDetails>): JSX.Element {
  return (
    <Text lineClamp={3} color={Color.BLACK}>
      {tableProps.value}
    </Text>
  )
}
function PathCell(tableProps: CellProps<InstanceDetails>): JSX.Element {
  return (
    <Text lineClamp={3} color={Color.BLACK}>
      {tableProps.value.length ? tableProps.value[0].path_match : ''}
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
const COGatewayReview: React.FC<COGatewayReviewProps> = props => {
  return (
    <Layout.Horizontal spacing="large" padding="large" style={{ height: '100vh', marginLeft: '230px' }}>
      <Container width="20%">
        <Layout.Vertical spacing="large" padding="large">
          <Heading level={2}>{i18n.gatewayDetails}</Heading>
          <Label>{i18n.nameYourGateway}</Label>
          <Text>{props.gatewayDetails.name}</Text>
          <Label>{i18n.selectCloudAccount}</Label>
          <Text>
            <Icon name={props.gatewayDetails.provider.icon as IconName} /> {props.gatewayDetails.cloudAccount.name}
          </Text>
        </Layout.Vertical>
      </Container>
      <Container className={css.configDetails} width="80%">
        <Layout.Vertical spacing="large" padding="large">
          <Heading level={2}>{i18n.configurationDetails}</Heading>
          <Label>{i18n.idleTime}</Label>
          <Text>{props.gatewayDetails.idleTimeMins}</Text>
          <Label>{i18n.instanceType}</Label>
          <Text>{props.gatewayDetails.fullfilment}</Text>
          <Label>{i18n.instance}</Label>
          {props.gatewayDetails.selectedInstances.length ? (
            <Table<InstanceDetails>
              data={props.gatewayDetails.selectedInstances}
              bpTableProps={{}}
              className={css.instanceTable}
              columns={[
                {
                  accessor: 'name',
                  Header: 'NAME AND ID',
                  width: '16.5%',
                  Cell: NameCell
                },
                {
                  accessor: 'ipAddress',
                  Header: 'IP ADDRESS',
                  width: '16.5%',
                  Cell: TableCell,
                  disableSortBy: true
                },
                {
                  accessor: 'region',
                  Header: 'REGION',
                  width: '16.5%',
                  Cell: TableCell
                },
                {
                  accessor: 'type',
                  Header: 'TYPE',
                  width: '16.5%',
                  Cell: TableCell
                },
                {
                  accessor: 'tags',
                  Header: 'TAGS',
                  width: '16.5%',
                  Cell: TableCell
                },
                {
                  accessor: 'launchTime',
                  Header: 'LAUNCH TIME',
                  width: '16.5%',
                  Cell: TableCell
                },
                {
                  accessor: 'status',
                  Header: 'STATUS',
                  width: '16.5%',
                  Cell: TableCell
                }
              ]}
            />
          ) : null}
          <Label>{i18n.routing}</Label>
          <Table<PortConfig>
            data={props.gatewayDetails.routing.ports}
            className={css.instanceTable}
            bpTableProps={{}}
            columns={[
              {
                accessor: 'protocol',
                Header: 'LISTEN PROTOCOL',
                width: '16.5%',
                Cell: TableCell
              },
              {
                accessor: 'port',
                Header: 'LISTON PORT',
                width: '16.5%',
                Cell: TableCell,
                disableSortBy: true
              },
              {
                accessor: 'action',
                Header: 'ACTION',
                width: '16.5%',
                Cell: TableCell
              },
              {
                accessor: 'target_protocol',
                Header: 'TARGET PROTOCOL',
                width: '16.5%',
                Cell: TableCell
              },
              {
                accessor: 'target_port',
                Header: 'TARGET PORT',
                width: '16.5%',
                Cell: TableCell
              },
              {
                accessor: 'redirect_url',
                Header: 'REDIRECT URL',
                width: '16.5%',
                Cell: TableCell
              },
              {
                accessor: 'server_name',
                Header: 'SERVER NAME',
                width: '16.5%',
                Cell: TableCell
              },
              {
                accessor: 'routing_rules',
                Header: 'PATH MATCH',
                width: '16.5%',
                Cell: PathCell
              }
            ]}
          />
        </Layout.Vertical>
      </Container>
    </Layout.Horizontal>
  )
}

export default COGatewayReview
