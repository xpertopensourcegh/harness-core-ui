import React, { useEffect, useState } from 'react'
import { Intent, Switch, Tab } from '@blueprintjs/core'
import { Layout, Container, Text, Icon, Link, Tag, Tabs, Heading, Avatar } from '@wings-software/uicore'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { getColorValue } from '@common/components/HeatMap/ColorUtils'
import { Service, ServiceSavings, useSavingsOfService } from 'services/lw'
import COGatewayLogs from './COGatewayLogs'
import COGatewayUsageTime from './COGatewayUsageTime'
import odIcon from './images/ondemandIcon.svg'
import spotIcon from './images/spotIcon.svg'
import { getRelativeTime } from './Utils'
import SpotvsODChart from './SpotvsODChart'
import css from './COGatewayList.module.scss'
interface COGatewayAnalyticsProps {
  service: Service
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

function getBarChartOptions(
  title: string,
  categories: string[],
  yAxisText: string,
  savingsData: number[],
  spendData: number[]
): Highcharts.Options {
  return {
    chart: {
      type: 'column'
    },
    colors: ['#27AE60', '#DA291D'],
    title: {
      text: title
    },
    xAxis: {
      categories: categories
    },
    yAxis: {
      min: 0,
      title: {
        text: yAxisText
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color: 'gray'
        }
      }
    },
    legend: {
      align: 'right',
      x: -30,
      verticalAlign: 'top',
      y: 25,
      floating: true,
      backgroundColor: 'white',
      borderColor: '#CCC',
      borderWidth: 1,
      shadow: false
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: false
        }
      }
    },
    series: [
      {
        name: 'Savings',
        type: 'column',
        data: savingsData
      },
      {
        name: 'Spend',
        type: 'column',
        data: spendData
      }
    ]
  }
}
const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ'
const GRAPH_CATEGORY_FORMAT = 'DD/MM'
const today = () => moment()
const startOfDay = (time: moment.Moment) => time.startOf('day').toDate()
const endOfDay = (time: moment.Moment) => time.endOf('day').toDate()
const COGatewayAnalytics: React.FC<COGatewayAnalyticsProps> = props => {
  const { orgIdentifier, projectIdentifier } = useParams<{
    orgIdentifier: string
    projectIdentifier: string
  }>()
  const [categories, setCategories] = useState<string[]>([])
  const [savingsSeries, setSavingsSeries] = useState<number[]>([])
  const [spendSeries, setSpendSeries] = useState<number[]>([])
  const { data, loading } = useSavingsOfService({
    org_id: orgIdentifier, // eslint-disable-line
    projectID: projectIdentifier, // eslint-disable-line
    serviceID: props.service.id as number
  })
  const { data: graphData, loading: graphLoading } = useSavingsOfService({
    org_id: orgIdentifier, // eslint-disable-line
    projectID: projectIdentifier, // eslint-disable-line
    serviceID: props.service.id as number,
    queryParams: {
      from: moment(startOfDay(today().subtract(7, 'days'))).format(DATE_FORMAT),
      to: moment(endOfDay(today())).format(DATE_FORMAT),
      group_by: 'date' // eslint-disable-line
    }
  })
  useEffect(() => {
    if (graphLoading) {
      return
    }
    const newCategroies: string[] = []
    const newSavings: number[] = []
    const newSpends: number[] = []
    const savingsEntries: ServiceSavings[] = graphData?.response ? (graphData.response as ServiceSavings[]) : []
    savingsEntries.forEach(element => {
      newCategroies.push(moment(element.usage_date).format(GRAPH_CATEGORY_FORMAT))
      newSavings.push(element.actual_savings as number)
      newSpends.push((element.potential_cost as number) - (element.actual_savings as number))
    })
    setCategories(newCategroies)
    setSavingsSeries(newSavings)
    setSpendSeries(newSpends)
  }, [graphData])
  return (
    <Container>
      <Layout.Vertical spacing="large" padding="xlarge">
        <Layout.Horizontal className={css.analyticsHeader}>
          <Layout.Horizontal width="50%">
            <Heading level={2} font={{ weight: 'semi-bold' }}>
              {props.service.name}
            </Heading>
          </Layout.Horizontal>
          <Layout.Horizontal spacing="large" width="50%" className={css.headerLayout}>
            <Layout.Horizontal flex spacing="large">
              <Switch defaultChecked={!props.service.disabled}></Switch>
              <Icon name="edit" style={{ marginBottom: '10px' }}></Icon>
              <Icon name="trash" style={{ marginBottom: '10px' }}></Icon>
            </Layout.Horizontal>
          </Layout.Horizontal>
        </Layout.Horizontal>
        <Text>
          Created by <Avatar email="john.doe@harnes.io" size={'small'} />
          {'John Doe '}
          {getRelativeTime(props.service.created_at as string, 'YYYY-MM-DDTHH:mm:ssZ')}
        </Text>
        <Heading level={3}>DETAILS</Heading>
        <Layout.Horizontal spacing="large" padding="medium">
          <Layout.Vertical spacing="large" padding="medium">
            <Text>Connector</Text>
            <Layout.Horizontal spacing="medium">
              <Icon name="service-aws" />
              <Text>lightwingapp-lightwing</Text>
            </Layout.Horizontal>
            <Text>Idle time</Text>
            <Layout.Horizontal spacing="medium">
              <Icon name="deployment-timeout-legacy" />
              <Text>{props.service.idle_time_mins}</Text>
            </Layout.Horizontal>
            <Text>Compute type</Text>
            <Layout.Horizontal spacing="medium">
              <img src={props.service.fulfilment == 'spot' ? spotIcon : odIcon} alt="" aria-hidden />
              <Text>{props.service.fulfilment}</Text>
            </Layout.Horizontal>
          </Layout.Vertical>
          <Layout.Vertical spacing="large" padding="medium">
            <Text>Instances managed by the Rule</Text>
            <Layout.Horizontal spacing="medium">
              <Link href="blahblah blah" target="_blank">
                2 Instances
              </Link>
              <Tag intent={Intent.SUCCESS} minimal={true} style={{ borderRadius: '25px' }}>
                ALL RUNNING
              </Tag>
            </Layout.Horizontal>
            <Text>Host name</Text>
            <Link href={`http://${props.service.host_name}`} target="_blank">
              {props.service.host_name}
            </Link>
            <Text>Custom Domain</Text>
            <Link href={`http://${props.service.custom_domains}?.join('')`} target="_blank">
              {props.service.custom_domains?.join('')}
            </Link>
          </Layout.Vertical>
        </Layout.Horizontal>
        <Container padding="medium" style={{ backgroundColor: '#f7fbfe' }}>
          <Layout.Horizontal spacing="large">
            {loading ? (
              <Icon name="spinner" size={12} color="blue500" />
            ) : (
              <>
                <Layout.Horizontal spacing="medium">
                  {props.service.fulfilment == 'spot' ? <SpotvsODChart spotPercent={76}></SpotvsODChart> : null}
                  <Layout.Horizontal spacing="medium">
                    <HighchartsReact
                      highchart={Highcharts}
                      options={
                        data?.response != null
                          ? getRiskGaugeChartOptions((data?.response as ServiceSavings).savings_percentage as number)
                          : getRiskGaugeChartOptions(0)
                      }
                    />
                    <Layout.Vertical spacing="medium" padding="large">
                      <Text>
                        $
                        {data?.response != null
                          ? Math.round(((data?.response as ServiceSavings).actual_savings as number) * 100) / 100
                          : 0}
                      </Text>
                      <Text>Cumulative Savings</Text>
                    </Layout.Vertical>
                  </Layout.Horizontal>
                </Layout.Horizontal>
              </>
            )}
          </Layout.Horizontal>
        </Container>
        <Layout.Horizontal spacing="small">
          Showing data for
          <Link href="b" target="_blank">
            Last 7 days
          </Link>
        </Layout.Horizontal>
        <Heading level={3}>SPEND VS SAVINGS</Heading>
        {graphLoading ? (
          <Icon name="spinner" size={24} color="blue500" />
        ) : (
          <HighchartsReact
            highchart={Highcharts}
            options={getBarChartOptions('', categories, '', savingsSeries, spendSeries)}
          />
        )}
        <Heading level={3}>LOGS AND USAGE TIME</Heading>
        <Tabs id="logsAndUsage">
          <Tab id="name" title={'Usage Time'} panel={<COGatewayUsageTime service={props.service} />}></Tab>
          <Tab id="logs" title={'Logs'} panel={<COGatewayLogs service={props.service} />}></Tab>
        </Tabs>
      </Layout.Vertical>
    </Container>
  )
}

export default COGatewayAnalytics
