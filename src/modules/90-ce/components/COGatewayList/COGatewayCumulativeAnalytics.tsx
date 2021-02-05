import { ProgressBar } from '@blueprintjs/core'
import { Color, Container, Heading, Intent, Layout, Tag, Text } from '@wings-software/uicore'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React from 'react'
import type { Service } from 'services/lw'
import odIcon from './images/ondemandIcon.svg'
import spotIcon from './images/spotIcon.svg'
import css from './COGatewayCumulativeAnalytics.module.scss'
interface COGatewayCumulativeAnalyticsProps {
  services: Service[]
}
function getStackedAreaChartOptions(
  title: string,
  categories: string[],
  yAxisText: string,
  savingsData: number[],
  spendData: number[]
): Highcharts.Options {
  return {
    chart: {
      type: 'area',
      height: '200px'
    },
    colors: ['#27AE60', '#DA291D'],
    title: {
      text: title
    },
    xAxis: {
      categories: categories,
      labels: {
        step: 4
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: yAxisText
      }
    },
    credits: {
      enabled: false
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
      spline: {
        stacking: 'normal'
      }
    },
    series: [
      {
        name: 'Savings',
        type: 'area',
        data: savingsData,
        showInLegend: false,
        color: {
          linearGradient: {
            x1: 0,
            x2: 1,
            y1: 0,
            y2: 1
          },
          stops: [
            [0, 'rgba(66, 171, 69, 0.7)'],
            [1, 'rgba(66, 171, 69, 0)']
          ]
        }
      },
      {
        name: 'Spend',
        type: 'area',
        data: spendData,
        showInLegend: false,
        color: {
          linearGradient: {
            x1: 0,
            x2: 1,
            y1: 0,
            y2: 1
          },
          stops: [
            [0, 'rgba(218, 41, 29, 0.7)'],
            [1, 'rgba(218, 41, 29, 0) 55.59%)']
          ]
        }
      }
    ]
  }
}
const COGatewayCumulativeAnalytics: React.FC<COGatewayCumulativeAnalyticsProps> = props => {
  return (
    <Container padding="small">
      <Layout.Vertical spacing="large">
        <Heading
          level={2}
          style={{
            marginLeft: '30px'
          }}
        >
          SUMMARY OF RULES
        </Heading>
        <Layout.Horizontal
          spacing="large"
          background={Color.WHITE}
          style={{
            boxShadow: '0px 0px 1px rgba(40, 41, 61, 0.04), 0px 2px 4px rgba(96, 97, 112, 0.16)',
            borderRadius: '6px',
            margin: '20px',
            padding: '30px'
          }}
        >
          <Layout.Vertical spacing="large">
            <Heading level={2}>ACTIVE RULES</Heading>
            <Layout.Horizontal spacing="small">
              <Heading level={1}>{props.services.length}</Heading>
              <Text style={{ alignSelf: 'center' }}>Rules</Text>
            </Layout.Horizontal>
            <Heading level={2}>INSTANCES MANAGED</Heading>
            <Layout.Horizontal spacing="small">
              <Heading level={1}>684</Heading>
              <Text style={{ alignSelf: 'center' }}>Instances</Text>
            </Layout.Horizontal>
            <Layout.Horizontal spacing="small">
              <Text style={{ alignSelf: 'center' }}>204</Text>
              <Tag intent={Intent.SUCCESS} minimal={true} style={{ borderRadius: '25px' }}>
                RUNNING
              </Tag>
            </Layout.Horizontal>
            <Layout.Horizontal spacing="small">
              <Text style={{ alignSelf: 'center' }}>478</Text>
              <Tag intent={Intent.DANGER} minimal={true} style={{ borderRadius: '25px' }}>
                STOPPED
              </Tag>
            </Layout.Horizontal>
          </Layout.Vertical>
          <Layout.Vertical spacing="large">
            <Heading level={2}>SPOT/ON-DEMAND USAGE</Heading>
            <Layout.Vertical spacing="large" padding="small">
              <Layout.Horizontal spacing="small">
                <img src={odIcon} alt="" aria-hidden />
                <Text>On-demand (33%)</Text>
              </Layout.Horizontal>
              <Layout.Vertical spacing="small">
                <Text>300m 55m</Text>
                <ProgressBar intent={Intent.PRIMARY} value={0.33} stripes={false} />
              </Layout.Vertical>
            </Layout.Vertical>
            <Layout.Vertical spacing="large" padding="small">
              <Layout.Horizontal spacing="small">
                <img src={spotIcon} alt="" aria-hidden />
                <Text>Spot (66%)</Text>
              </Layout.Horizontal>
              <Layout.Vertical spacing="small">
                <Text>975m 36m</Text>
                <ProgressBar intent={Intent.PRIMARY} value={0.66} stripes={false} className={css.spotUsage} />
              </Layout.Vertical>
            </Layout.Vertical>
          </Layout.Vertical>
          <Layout.Vertical spacing="large" width="50%">
            <Heading level={2}>TOTAL SPEND VS SAVINGS</Heading>
            <HighchartsReact
              highchart={Highcharts}
              options={getStackedAreaChartOptions(
                '',
                ['17/01/2020', '18/01/2020', '19/01/2020', '21/01/20202', '23/01/2020', '30/01/2020', '31/01/2020'],
                '',
                [500, 1000, 900, 2100, 5000, 1000, 2000],
                [100, 700, 200, 500, 300, 800, 400]
              )}
            />
          </Layout.Vertical>
          <Layout.Vertical spacing="medium">
            <Layout.Vertical spacing="large" padding="small">
              <Container padding="medium" background={Color.GREEN_300} style={{ borderRadius: '4px' }}>
                <Layout.Vertical spacing="small">
                  <Text color={Color.GREEN_500}>TOTAL SAVINGS TILL DATE</Text>
                  <Heading level={1} color={Color.GREEN_500}>
                    $16858.467
                  </Heading>
                </Layout.Vertical>
              </Container>
              <Container padding="medium" background={Color.RED_300} style={{ borderRadius: '4px' }}>
                <Layout.Vertical spacing="small">
                  <Text color={Color.RED_500}>TOTAL POTENTIAL SPEND</Text>
                  <Heading level={1} color={Color.RED_500}>
                    $17586.99
                  </Heading>
                </Layout.Vertical>
              </Container>
            </Layout.Vertical>
          </Layout.Vertical>
        </Layout.Horizontal>
      </Layout.Vertical>
    </Container>
  )
}

export default COGatewayCumulativeAnalytics
