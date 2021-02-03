import React, { useState } from 'react'
import type { CellProps, Renderer } from 'react-table'
import {
  Text,
  Color,
  Layout,
  Container,
  Button,
  Icon,
  ModalErrorHandler,
  ModalErrorHandlerBinding,
  Link,
  ExpandingSearchInput,
  Popover,
  Tag
} from '@wings-software/uicore'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { Classes, Drawer, Intent, Menu, Position } from '@blueprintjs/core'
import routes from '@common/RouteDefinitions'
import {
  Service,
  ServiceSavings,
  useGetServices,
  useHealthOfService,
  useRequestsOfService,
  useSavingsOfService
} from 'services/lw'
import { Page } from '@common/components/Page/Page'
import Table from '@common/components/Table/Table'
import { getColorValue } from '@common/components/HeatMap/ColorUtils'
import COGatewayAnalytics from './COGatewayAnalytics'
import odIcon from './images/ondemandIcon.svg'
import spotIcon from './images/spotIcon.svg'
import { getRelativeTime } from './Utils'
import css from './COGatewayList.module.scss'

const gatewayStateMap: { [key: string]: JSX.Element } = {
  down: (
    <Tag intent={Intent.DANGER} minimal={true} style={{ borderRadius: '25px' }}>
      STOPPED
    </Tag>
  ),
  active: (
    <Tag intent={Intent.SUCCESS} minimal={true} style={{ borderRadius: '25px' }}>
      RUNNING
    </Tag>
  )
}

function getStateTag(state: string): JSX.Element {
  return gatewayStateMap[state]
}

function IconCell(tableProps: CellProps<Service>): JSX.Element {
  return (
    <Layout.Horizontal spacing="medium">
      <img src={tableProps.value == 'spot' ? spotIcon : odIcon} alt="" aria-hidden />
      <Text lineClamp={3} color={Color.GREY_500}>
        {tableProps.value}
      </Text>
    </Layout.Horizontal>
  )
}
function TimeCell(tableProps: CellProps<Service>): JSX.Element {
  return (
    <Text lineClamp={3} color={Color.GREY_500}>
      {tableProps.value} mins
    </Text>
  )
}
function NameCell(tableProps: CellProps<Service>): JSX.Element {
  return (
    <Text lineClamp={3} color={Color.BLACK} style={{ fontWeight: 600 }}>
      {/* <Icon name={tableProps.row.original.provider.icon as IconName}></Icon> */}
      {tableProps.value}
    </Text>
  )
}
const RenderColumnMenu: Renderer<CellProps<Service>> = ({ row }) => {
  const data = row.original.id
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <Layout.Horizontal className={css.layout}>
      <Popover
        isOpen={menuOpen}
        onInteraction={nextOpenState => {
          setMenuOpen(nextOpenState)
        }}
        className={Classes.DARK}
        position={Position.BOTTOM_RIGHT}
      >
        <Button
          minimal
          icon="Options"
          iconProps={{ size: 24 }}
          onClick={e => {
            e.stopPropagation()
            setMenuOpen(true)
          }}
          data-testid={`menu-${data}`}
        />
        <Menu style={{ minWidth: 'unset' }}>
          {row.original.disabled ? (
            <Menu.Item
              icon="play"
              text="Enable"
              onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                e.stopPropagation()
                alert('you are enabling')
              }}
            />
          ) : (
            <Menu.Item
              icon="disable"
              text="Disable"
              onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
                e.stopPropagation()
                alert('you are disabling')
              }}
            />
          )}
          <Menu.Item
            icon="edit"
            text="Edit"
            onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
              e.stopPropagation()
              alert('you are editing')
            }}
          />
          <Menu.Item
            icon="trash"
            text="Delete"
            onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) => {
              e.stopPropagation()
              alert('you are deleting')
            }}
          />
        </Menu>
      </Popover>
    </Layout.Horizontal>
  )
}
const PLOT_LINE_LOCATIONS = [11, 22, 33, 44, 55, 66, 77, 88].map(degree => ({
  color: 'white',
  value: degree,
  zIndex: 10
}))

function getRiskGaugeChartOptions(riskScore: number): Highcharts.Options {
  const gaugeColor = riskScore === -1 ? 'var(--grey-200)' : getColorValue(100 - riskScore, 0, 100)

  return {
    chart: {
      height: 50,
      width: 50,
      backgroundColor: 'transparent',
      spacing: [0, 0, 0, 0]
    },
    credits: {
      enabled: false
    },
    title: undefined,
    pane: {
      size: '100%',
      startAngle: -90,
      endAngle: 90,
      background: [
        {
          borderWidth: 0,
          innerRadius: '80%',
          outerRadius: '100%',
          shape: 'arc'
        }
      ]
    },
    tooltip: {
      enabled: false
    },
    xAxis: {
      tickAmount: 0
    },
    plotOptions: {
      gauge: {
        dataLabels: {
          enabled: false
        },
        dial: {
          radius: '45%',
          backgroundColor: gaugeColor,
          baseLength: '40%'
        },
        pivot: {
          backgroundColor: 'white',
          borderColor: gaugeColor,
          borderWidth: 1,
          radius: 3
        }
      }
    },
    yAxis: {
      lineWidth: 0,
      minorTickInterval: null,
      min: 0,
      max: 100,
      tickAmount: 0,
      tickColor: 'transparent',
      plotBands: [
        {
          thickness: 5,
          from: 0,
          to: riskScore,
          color: gaugeColor
        },
        {
          thickness: 5,
          from: riskScore,
          to: 100,
          color: '#EEE'
        }
      ],
      plotLines: PLOT_LINE_LOCATIONS,
      labels: {
        enabled: false
      }
    },
    series: [
      {
        name: 'Risk Score',
        type: 'gauge',
        data: [riskScore]
      }
    ]
  }
}

const COGatewayList: React.FC = () => {
  const history = useHistory()
  const { accountId, orgIdentifier, projectIdentifier } = useParams<{
    accountId: string
    orgIdentifier: string
    projectIdentifier: string
  }>()
  const [modalErrorHandler, setModalErrorHandler] = useState<ModalErrorHandlerBinding | undefined>()
  const [page, setPage] = useState(0)
  const [selectedService, setSelectedService] = useState<Service>()
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  function SavingsCell(tableProps: CellProps<Service>): JSX.Element {
    const { data, loading } = useSavingsOfService({
      org_id: orgIdentifier, // eslint-disable-line
      projectID: projectIdentifier, // eslint-disable-line
      serviceID: tableProps.row.original.id as number,
      debounce: 300
    })
    return (
      <Layout.Horizontal spacing="large">
        <HighchartsReact
          highchart={Highcharts}
          options={
            data?.response != null
              ? getRiskGaugeChartOptions((data?.response as ServiceSavings).savings_percentage as number)
              : getRiskGaugeChartOptions(0)
          }
        />
        <Text className={css.savingsAmount}>
          {data?.response != null ? (
            `$${Math.round(((data?.response as ServiceSavings).actual_savings as number) * 100) / 100}`
          ) : !loading ? (
            0
          ) : (
            <Icon name="spinner" size={12} color="blue500" />
          )}
        </Text>
      </Layout.Horizontal>
    )
  }
  function ActivityCell(tableProps: CellProps<Service>): JSX.Element {
    const { data, loading } = useRequestsOfService({
      org_id: orgIdentifier, // eslint-disable-line
      projectID: projectIdentifier, // eslint-disable-line
      serviceID: tableProps.row.original.id as number,
      debounce: 300
    })
    return (
      <>
        {data?.response?.length ? (
          <Layout.Horizontal spacing="medium">
            <Icon name="history" />
            <Text lineClamp={3} color={Color.GREY_500}>
              {getRelativeTime(data.response[0].created_at as string, 'YYYY-MM-DDTHH:mm:ssZ')}
            </Text>
          </Layout.Horizontal>
        ) : !loading ? (
          '-'
        ) : (
          <Icon name="spinner" size={12} color="blue500" />
        )}
      </>
    )
  }
  function ResourcesCell(tableProps: CellProps<Service>): JSX.Element {
    const { data, loading } = useHealthOfService({
      org_id: orgIdentifier, // eslint-disable-line
      projectID: projectIdentifier, // eslint-disable-line
      serviceID: tableProps.row.original.id as number,
      debounce: 300
    })
    return (
      <Container>
        <Layout.Vertical spacing="large">
          <Layout.Horizontal spacing="large">
            <Link href="blah" style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              2 Instances
            </Link>
            <Text lineClamp={3} color={Color.GREY_500}>
              Host name:
              <Link
                href={`http://${tableProps.row.original.host_name}`}
                target="_blank"
                style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {tableProps.row.original.host_name}
              </Link>
            </Text>
          </Layout.Horizontal>
          <Layout.Horizontal spacing="large">
            {data?.response?.['state'] != null ? (
              getStateTag(data?.response?.['state'])
            ) : !loading ? (
              getStateTag('down')
            ) : (
              <Icon name="spinner" size={12} color="blue500" />
            )}
            <Text lineClamp={3} color={Color.GREY_500}>
              Custom Domain: {tableProps.row.original.custom_domains?.join(',')}
            </Text>
          </Layout.Horizontal>
        </Layout.Vertical>
        {/* <Icon name={tableProps.row.original.provider.icon as IconName}></Icon> */}
        {tableProps.value}
      </Container>
    )
  }
  const { data, error } = useGetServices({
    org_id: orgIdentifier, // eslint-disable-line
    project_id: projectIdentifier, // eslint-disable-line
    debounce: 300
  })
  if (error) {
    modalErrorHandler?.showDanger(error.data || error.message)
  }
  return (
    <>
      <Page.Header title="Autostopping Rules" className={css.header} />
      <Drawer
        autoFocus={true}
        enforceFocus={true}
        hasBackdrop={true}
        usePortal={true}
        canOutsideClickClose={true}
        canEscapeKeyClose={true}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
        }}
        size="656px"
        style={{
          boxShadow: '0px 2px 8px rgba(40, 41, 61, 0.04), 0px 16px 24px rgba(96, 97, 112, 0.16)',
          borderRadius: '8px',
          overflowY: 'scroll'
        }}
      >
        <COGatewayAnalytics service={selectedService as Service} />
      </Drawer>
      <>
        <Layout.Horizontal padding="large">
          <Layout.Horizontal width="55%">
            <Button
              intent="primary"
              text="New Autostopping Rule"
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
          <Layout.Horizontal spacing="small" width="45%" className={css.headerLayout}>
            <Layout.Horizontal flex>
              <ExpandingSearchInput
                placeholder="search"
                // onChange={text => {
                //   // console.log(text)
                //   // setSearchParam(text.trim())
                // }}
                className={css.search}
              />
            </Layout.Horizontal>
          </Layout.Horizontal>
        </Layout.Horizontal>
      </>
      <ModalErrorHandler bind={setModalErrorHandler} />
      <Page.Body className={css.pageContainer}>
        <Table<Service>
          data={data?.response ? data.response : []}
          className={css.table}
          pagination={{
            itemCount: 50, //data?.data?.totalItems || 0,
            pageSize: 10, //data?.data?.pageSize || 10,
            pageCount: 5, //data?.data?.totalPages || 0,
            pageIndex: page, //data?.data?.pageIndex || 0,
            gotoPage: (pageNumber: number) => setPage(pageNumber)
          }}
          onRowClick={e => {
            setSelectedService(e)
            setIsDrawerOpen(true)
          }}
          columns={[
            {
              accessor: 'name',
              Header: 'Name'.toUpperCase(),
              width: '18%',
              Cell: NameCell
            },
            {
              accessor: 'idle_time_mins',
              Header: 'Idle Time'.toUpperCase(),
              width: '8%',
              Cell: TimeCell
            },
            {
              accessor: 'fulfilment',
              Header: 'Compute Type'.toUpperCase(),
              width: '12%',
              Cell: IconCell
            },
            {
              Header: 'Resources Managed By The Rule'.toUpperCase(),
              width: '32%',
              Cell: ResourcesCell
            },
            {
              Header: 'Cumulative Savings'.toUpperCase(),
              width: '15%',
              Cell: SavingsCell,
              disableSortBy: true
            },
            {
              Header: 'Last Activity'.toUpperCase(),
              width: '10%',
              Cell: ActivityCell
            },
            {
              Header: '',
              id: 'menu',
              accessor: row => row.id,
              width: '5%',
              Cell: RenderColumnMenu,
              disableSortBy: true
            }
          ]}
        />
      </Page.Body>
    </>
  )
}

export default COGatewayList
