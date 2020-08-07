import React, { FunctionComponent, useState, useCallback, useEffect, useRef } from 'react'
import { Tabs, Tab, Container, Text, Color, Icon, Popover, OverlaySpinner } from '@wings-software/uikit'
import Highcharts from 'highcharts/highcharts'
import HighchartsReact from 'highcharts-react-official'
import cx from 'classnames'
import cloneDeep from 'lodash/cloneDeep'
import get from 'lodash/get'
import xhr from '@wings-software/xhr-async'
import { Toaster, Intent } from '@blueprintjs/core'
import { Position } from '@blueprintjs/core'
import { routeParams } from 'framework/route/RouteMounter'
import { fetchTimeseries } from '../../../../services/AnomaliesService'
import i18n from './MetricAnalysisView.i18n'
import { timeSeriesChartConfig, timelineConfig } from '../../AnomalyAnalysisUtils'
import css from './MetricsView.module.scss'

interface MetricsViewProps {
  currentAnomaly: any
}

const toaster = Toaster.create()

const fetchTimeseriesData = async (state: any, params: any) => {
  const requestID = Date.now()
  state.requestID.current = requestID
  state.setInProgress(true)
  state.setTimeseries([])
  const { response, status, error } = await fetchTimeseries(params)

  if (status === xhr.ABORTED) {
    return
  }

  if (status !== 200) {
    toaster.show({ intent: Intent.DANGER, timeout: 5000, message: error + '' })
    return
  }

  if (requestID === state.requestID.current) {
    if (response?.resource) {
      const { metricName, txnDetails } = state.selectedMetric.current
      const values = response.resource?.metricGroupValues[metricName] || {}
      state.setTimeseries(
        txnDetails.map((item: any) => ({
          name: item.groupName,
          data: values[item.groupName],
          chartConfig: timeSeriesChartConfig(
            state.range.from,
            state.range.to,
            values[item.groupName].map(({ timestamp, value }: any) => [timestamp, value])
          )
        }))
      )
    }
    state.setInProgress(false)
  }
}

const MetricsView: FunctionComponent<any> = (props: MetricsViewProps) => {
  const [isAnomalousTabSelected, setAnomalousTabSelected] = useState(false)

  const [selectedMetric, setSelectedMetric] = useState<any>({})
  const [selectedSerie, setSelectedSerie] = useState<any>(null)
  const [timeseries, setTimeseries] = useState([])
  const [inProgress, setInProgress] = useState(false)
  const requestID = useRef()

  const {
    params: { accountId },
    query: { from, to }
  } = routeParams()

  const state = {
    selectedMetric,
    setSelectedMetric,
    timeseries,
    setTimeseries,
    inProgress,
    setInProgress,
    requestID,
    range: {
      from: Number.parseInt(from as string),
      to: Number.parseInt(to as string)
    }
  }

  useEffect(() => {
    const cvConfig = get(props, 'currentAnomaly.anomalyDetails[0]')
    if (cvConfig && cvConfig.metricDetails) {
      setSelectedMetric({
        cvConfigId: cvConfig.cvConfigId,
        current: cvConfig.metricDetails[0]
      })
      setSelectedSerie(null)
    }
  }, [props])

  useEffect(() => {
    if (selectedMetric.current) {
      fetchTimeseriesData(state, {
        accountId: accountId,
        env: 'env',
        service: 'service',
        cvConfigId: selectedMetric.cvConfigId,
        metricName: selectedMetric.current.metricName,
        startTime: from,
        endTime: to
      })
    }
  }, [selectedMetric])

  const onTabChangeCallback = useCallback(
    (selectedTab: string) => setAnomalousTabSelected(selectedTab === i18n.analysisTabs.anomalous),
    []
  )

  const onSelectMetric = (cvConfigId: string, metric: any) => {
    const { currentAnomaly } = props
    const cvConfig =
      currentAnomaly && currentAnomaly.anomalyDetails.find((config: any) => config.cvConfigId === cvConfigId)
    if (cvConfig) {
      const current = cvConfig.metricDetails.find((m: any) => m === metric)
      if (current) {
        setSelectedMetric({
          cvConfigId,
          current
        })
      }
    }
  }

  const onSelectSerie = (serie: any) => {
    serie = {
      ...serie,
      chartConfig: cloneDeep(serie.chartConfig)
    }
    serie.chartConfig.chart.height = 280
    serie.chartConfig.xAxis.labels.enabled = true
    serie.chartConfig.yAxis.labels.enabled = true
    serie.chartConfig.yAxis.lineWidth = 1
    delete serie.chartConfig.xAxis.tickLength
    delete serie.chartConfig.xAxis.lineWidth
    delete serie.chartConfig.xAxis.gridLineWidth
    setSelectedSerie(serie)
  }

  function renderSelectedSerie() {
    const options = selectedSerie?.chartConfig
    options.chart.height = 280
    options.xAxis.labels.enabled = true
    options.yAxis.labels.enabled = true
    options.yAxis.lineWidth = 1
    delete options.xAxis.tickLength
    delete options.xAxis.lineWidth
    delete options.xAxis.gridLineWidth
    return (
      <Container className={css.detailed} key={1}>
        <Container className={css.leftSection}>
          <div className={css.name}> {selectedSerie.name} </div>
        </Container>
        <Container>
          <HighchartsReact highcharts={Highcharts} options={options} key={1} />
        </Container>
        <Container className={css.actions}>
          <Icon
            name="cross"
            size={18}
            onClick={() => {
              setSelectedSerie(null)
            }}
          ></Icon>
        </Container>
      </Container>
    )
  }

  function renderContent() {
    return (
      <OverlaySpinner show={inProgress}>
        <Container className={css.allTabContent}>
          <SideNav anomaly={props.currentAnomaly} selectedMetric={selectedMetric.current} onSelect={onSelectMetric} />
          <div>
            {selectedSerie && <div>{renderSelectedSerie()}</div>}
            {timeseries &&
              !selectedSerie &&
              timeseries.map((timeserie: any) => (
                <Container className={css.row} key={timeserie.name}>
                  <Container className={css.leftSection}>
                    <div className={css.name}> {timeserie.name} </div>
                  </Container>
                  <Container>
                    <HighchartsReact highcharts={Highcharts} options={timeserie.chartConfig} key={timeserie.name} />
                  </Container>
                  <Container className={css.actions}>
                    <Icon name="fullscreen" size={15} color={'grey350'} onClick={() => onSelectSerie(timeserie)}></Icon>
                  </Container>
                  <Container className={css.actions}>
                    <Popover position={Position.RIGHT_TOP}>
                      <Icon color={'grey350'} name="more" size={16} padding="small" />
                    </Popover>
                  </Container>
                </Container>
              ))}
            {!!(timeseries && timeseries.length && !selectedSerie) && (
              <ChartFooter startTime={state.range.from} endTime={state.range.to} />
            )}
          </div>
        </Container>
      </OverlaySpinner>
    )
  }

  return (
    <Container className={css.main}>
      <Container className={css.heading}>
        <Text color={Color.BLACK} className={css.filterHeading}>{`${i18n.filterHeading}`}</Text>
        <Container className={css.tabContainer}>
          <Tabs id="LogAnalysisTabs" onChange={onTabChangeCallback}>
            {/* <Tab id={i18n.analysisTabs.anomalous} title={i18n.analysisTabs.anomalous} /> */}
            <Tab id={i18n.analysisTabs.all} title={i18n.analysisTabs.all} />
          </Tabs>
        </Container>
      </Container>

      {isAnomalousTabSelected ? (
        <Container className={css.anomalousTabContent}>{/** TODO */}</Container>
      ) : (
        <Container>{renderContent()}</Container>
      )}
    </Container>
  )
}

function SideNav({ anomaly, selectedMetric, onSelect }: any) {
  const mapConfigId = (id: number) => {
    switch (id) {
      default:
        return 'APPDYNAMICS'
    }
  }
  const mapIcon = (id: number) => {
    switch (mapConfigId(id)) {
      case 'APPDYNAMICS':
        return <Icon name="service-appdynamics" size={18}></Icon>
      case 'SPLUNK':
        return <Icon name="service-splunk" size={18}></Icon>
      default:
        return null
    }
  }
  return get(anomaly, 'anomalyDetails', []).map(({ cvConfigId, metricDetails }: any) => (
    <Container key={cvConfigId}>
      {mapIcon(cvConfigId)}
      {mapConfigId(cvConfigId)}
      <ul className={css.ul}>
        {Array.isArray(metricDetails) &&
          metricDetails.map(metric => (
            <li
              className={cx(css.li, {
                [css.active]: selectedMetric === metric
              })}
              key={metric.metricName}
              onClick={() => onSelect(cvConfigId, metric)}
            >
              <div> {metric.metricName} </div>
            </li>
          ))}
      </ul>
    </Container>
  ))
}

function ChartFooter({ startTime, endTime, transactions }: any) {
  return (
    <Container className={css.footer}>
      <span className={css.total}>
        {i18n.totalTransactions}: {transactions}
      </span>
      <span className={css.leftIcon}>
        <Icon name={'chevron-left'} size={24}>
          {' '}
        </Icon>
      </span>
      <span>
        <HighchartsReact highcharts={Highcharts} options={timelineConfig(startTime, endTime)} />
      </span>
      <span className={css.rightIcon}>
        <Icon name={'chevron-right'} size={24}>
          {' '}
        </Icon>
      </span>
    </Container>
  )
}

export default MetricsView
