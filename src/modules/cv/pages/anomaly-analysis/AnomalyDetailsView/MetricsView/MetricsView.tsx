import React, { FunctionComponent, useState, useCallback, useEffect } from 'react'
import css from './MetricsView.module.scss'
import { Tabs, Tab, Container, Text, Color, Icon, Popover } from '@wings-software/uikit'
import Highcharts from 'highcharts/highcharts'
import HighchartsReact from 'highcharts-react-official'
import i18n from './MetricAnalysisView.i18n'
import cx from 'classnames'
import cloneDeep from 'lodash/cloneDeep'
import { dummyConfigForTimeline } from '../../AnomalyAnalysisUtils'
import { Position } from '@blueprintjs/core'

interface MetricsViewProps {
  currentAnomaly: any
}

const MetricsView: FunctionComponent<any> = (props: MetricsViewProps) => {
  const metricInfo = props.currentAnomaly.info.metric

  const [isAnomalousTabSelected, setAnomalousTabSelected] = useState(true)
  const [idSelected, setIdSelected] = useState<any>()
  const [currentMetricInAll, setCurrentMetricInAll] = useState<any>()
  const [showDetailedInAnomalous, setShowDetailedInAnomalous] = useState<any>()
  const [showDetailedInAll, setShowDetailedInAll] = useState<any>()

  useEffect(() => {
    setIdSelected(metricInfo.all[0]?.id)
    setCurrentMetricInAll([metricInfo.all[0]])
  }, [props])

  const onTabChangeCallback = useCallback(
    (selectedTab: string) => setAnomalousTabSelected(selectedTab === i18n.analysisTabs.anomalous),
    []
  )

  function renderAnomalousTab(anomalous: any) {
    if (showDetailedInAnomalous && showDetailedInAnomalous.id) {
      const options = cloneDeep(showDetailedInAnomalous.options)
      options.chart.height = 280
      options.xAxis.labels.enabled = true
      options.yAxis.labels.enabled = true
      options.yAxis.lineWidth = 1
      delete options.xAxis.tickLength
      delete options.xAxis.lineWidth
      delete options.xAxis.gridLineWidth

      return (
        <Container className={css.detailed} key={showDetailedInAnomalous.id}>
          <Container className={css.leftSection}>
            <Icon name="service-splunk" size={12}>
              {' '}
            </Icon>
            <div className={css.name}> {showDetailedInAnomalous.name} </div>
            <div className={css.metric}> {showDetailedInAnomalous.metric} </div>
          </Container>
          <Container>
            <HighchartsReact highcharts={Highcharts} options={options} key={showDetailedInAnomalous.id} />
          </Container>
          <Container className={css.actions}>
            <Icon
              name="cross"
              size={18}
              onClick={() => {
                setShowDetailedInAnomalous(null)
              }}
            ></Icon>
          </Container>
        </Container>
      )
    } else {
      return (
        <div>
          {anomalous.map((info: any, index: number) => {
            info.options.chart.height = 70
            info.options.xAxis.labels.enabled = false
            info.options.yAxis.labels.enabled = false
            info.options.yAxis.lineWidth = 0

            return (
              <Container className={css.row} key={index}>
                <Container className={css.leftSection}>
                  <Icon name="service-splunk" size={12}>
                    {' '}
                  </Icon>
                  <div className={css.name}> {info.name} </div>
                  <div className={css.metric}> {info.metric} </div>
                </Container>
                <Container>
                  <HighchartsReact highcharts={Highcharts} options={info.options} key={index} />
                </Container>
                <Container className={css.actions}>
                  <Icon
                    name="fullscreen"
                    size={15}
                    color={'grey350'}
                    onClick={() => {
                      setShowDetailedInAnomalous(info)
                    }}
                  ></Icon>
                </Container>
                <Container className={css.actions}>
                  <Popover position={Position.RIGHT_TOP}>
                    <Icon color={'grey350'} name="more" size={16} padding="small" />
                  </Popover>
                </Container>
              </Container>
            )
          })}
          {
            <Container className={css.footer}>
              <span className={css.leftIcon}>
                <Icon name={'chevron-left'} size={24}>
                  {' '}
                </Icon>
              </span>
              <span>
                <HighchartsReact highcharts={Highcharts} options={dummyConfigForTimeline} />
              </span>
              <span className={css.rightIcon}>
                <Icon name={'chevron-right'} size={24}>
                  {' '}
                </Icon>
              </span>
            </Container>
          }
        </div>
      )
    }
  }

  function renderLeftNav(all: any) {
    const localAllMap = new Map()

    all.forEach((each: any) => {
      if (localAllMap.has(each.datasourceName)) {
        localAllMap.get(each.datasourceName).push(each)
      } else {
        localAllMap.set(each.datasourceName, [each])
      }
    })

    const result = []

    for (const [key, value] of localAllMap.entries()) {
      result.push(
        <Container key={key}>
          {key === 'APPDYNAMICS' ? (
            <Icon name="service-appdynamics" size={18}></Icon>
          ) : (
            <Icon name="service-splunk" size={18}></Icon>
          )}{' '}
          {key}
          <ul className={css.ul}>
            {value.map((val: any, index: number) => {
              return (
                <li
                  className={cx(css.li, {
                    [css.active]: idSelected === val.id
                  })}
                  key={index}
                  onClick={() => {
                    setShowDetailedInAnomalous(null)
                    setIdSelected(val.id)
                    setCurrentMetricInAll([val])
                  }}
                >
                  <div> {val.metric} </div>
                </li>
              )
            })}
          </ul>
        </Container>
      )
    }
    return result
  }

  function renderDetailsSection() {
    if (showDetailedInAll && showDetailedInAll.id) {
      const options = cloneDeep(showDetailedInAll.options)
      options.chart.height = 280
      options.xAxis.labels.enabled = true
      options.yAxis.labels.enabled = true
      options.yAxis.lineWidth = 1
      delete options.xAxis.tickLength
      delete options.xAxis.lineWidth
      delete options.xAxis.gridLineWidth

      return (
        <Container className={css.detailed} key={showDetailedInAll.id}>
          <Container className={css.leftSection}>
            <div className={css.name}> {showDetailedInAll.name} </div>
          </Container>
          <Container>
            <HighchartsReact highcharts={Highcharts} options={options} key={showDetailedInAll.id} />
          </Container>
          <Container className={css.actions}>
            <Icon
              name="cross"
              size={18}
              onClick={() => {
                setShowDetailedInAll(null)
              }}
            ></Icon>
          </Container>
        </Container>
      )
    } else {
      return (
        <div>
          {currentMetricInAll.map((info: any, index: number) => {
            info.options.chart.height = 70
            info.options.xAxis.labels.enabled = false
            info.options.yAxis.labels.enabled = false
            info.options.yAxis.lineWidth = 0

            return (
              <Container className={css.row} key={index}>
                <Container className={css.leftSection}>
                  <div className={css.name}> {info.name} </div>
                </Container>
                <Container>
                  <HighchartsReact highcharts={Highcharts} options={info.options} key={info.id} />
                </Container>
                <Container className={css.actions}>
                  <Icon
                    name="fullscreen"
                    size={15}
                    color={'grey350'}
                    onClick={() => {
                      setShowDetailedInAll(info)
                    }}
                  ></Icon>
                </Container>
                <Container className={css.actions}>
                  <Popover position={Position.RIGHT_TOP}>
                    <Icon color={'grey350'} name="more" size={16} padding="small" />
                  </Popover>
                </Container>
              </Container>
            )
          })}
          {
            <Container className={css.footer}>
              <span className={css.total}>
                {i18n.totalTransactions}: {currentMetricInAll.length}
              </span>
              <span className={css.leftIcon}>
                <Icon name={'chevron-left'} size={24}>
                  {' '}
                </Icon>
              </span>
              <span>
                <HighchartsReact highcharts={Highcharts} options={dummyConfigForTimeline} />
              </span>
              <span className={css.rightIcon}>
                <Icon name={'chevron-right'} size={24}>
                  {' '}
                </Icon>
              </span>
            </Container>
          }
        </div>
      )
    }
  }

  function renderAllTab(all: any) {
    return (
      <Container className={css.allTabContent}>
        <div>{renderLeftNav(all)}</div>
        <div>{renderDetailsSection()}</div>
      </Container>
    )
  }

  return (
    <Container className={css.main}>
      <Container className={css.heading}>
        <Text color={Color.BLACK} className={css.filterHeading}>{`${i18n.filterHeading}`}</Text>
        <Container className={css.tabContainer}>
          <Tabs id="LogAnalysisTabs" onChange={onTabChangeCallback}>
            <Tab id={i18n.analysisTabs.anomalous} title={i18n.analysisTabs.anomalous} />
            <Tab id={i18n.analysisTabs.all} title={i18n.analysisTabs.all} />
          </Tabs>
        </Container>
      </Container>

      {isAnomalousTabSelected ? (
        <Container className={css.anomalousTabContent}>{renderAnomalousTab(metricInfo.anomalous)}</Container>
      ) : (
        <Container>{renderAllTab(metricInfo.all)}</Container>
      )}
    </Container>
  )
}

export default MetricsView
