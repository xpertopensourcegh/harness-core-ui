import React, { useState, useEffect } from 'react'
import { Heading, Layout, Tabs, Tab, Select, OverlaySpinner, Container } from '@wings-software/uikit'
import { Toaster, Intent } from '@blueprintjs/core'
import xhr from '@wings-software/xhr-async'
import moment from 'moment'
import classnames from 'classnames'
import isEmpty from 'lodash/isEmpty'
import isUndefined from 'lodash/isUndefined'
import { DashboardService } from 'modules/cv/services'
import TimelineView from 'modules/common/components/TimelineView/TimelineView'
import HeatMap, { CellStatusValues } from 'modules/common/components/HeatMap/HeatMap'
import { Page } from 'modules/common/exports'
import { routeParams } from 'framework/exports'
import styles from './CVServicePage.module.scss'

const toaster = Toaster.create()

const TOOLTIP_TIME_FORMAT = 'MMMM Do YYYY, h:mm A'
const rangeOptions = [
  { label: '4 hrs', value: 4 },
  { label: '12 hrs', value: 12 },
  { label: '1 day', value: 24 },
  { label: '7 days', value: 7 * 24 },
  { label: '30 days', value: 30 * 24 }
]

const getRangeDates = (val: number) => {
  const now = moment()
  return {
    start: now.clone().subtract(val, 'hours'),
    end: now
  }
}

export default function CVServicePage(): JSX.Element {
  const {
    params: { accountId, serviceId }
  } = routeParams()
  const [range, setRange] = useState({
    selectedValue: 12,
    ...getRangeDates(12)
  })
  const [heatmapFetching, setHeatmapFetching] = useState(false)
  const [heatmapSummary, setHeatmapSummary] = useState<Array<any>>([
    { name: 'Performance', data: [] },
    { name: 'Resources', data: [] },
    { name: 'Quality', data: [] }
  ])
  const [timelineData, setTimelineData] = useState<Array<any>>([])

  const fetchHeatmapSummary = async () => {
    setHeatmapFetching(true)
    const { status, response, error } = await DashboardService.fetchHeatmapSummary({
      accId: accountId,
      env: 'env',
      service: serviceId as string,
      startTime: range.start.valueOf(),
      endTime: range.end.valueOf()
    })
    setHeatmapFetching(false)
    if (status === xhr.ABORTED) {
      return
    }

    if (status !== 200) {
      toaster.show({ intent: Intent.DANGER, timeout: 5000, message: error + '' })
      return
    }

    if (response?.resource) {
      const { resource } = response
      setHeatmapSummary(
        heatmapSummary.map(summary => {
          const data =
            resource[summary.name] || resource[summary.name.toUpperCase()] || resource[summary.name.toLowerCase()]
          if (data) {
            return {
              name: summary.name,
              data
            }
          } else {
            return summary
          }
        })
      )
    }
  }

  const fetchTimelineMockData = () => {
    setTimelineData(mockTimelineData(range.start))
  }

  useEffect(() => {
    fetchHeatmapSummary()
    fetchTimelineMockData()
  }, [range])

  const mapHeatmapValue = (val: any) => {
    return isUndefined(val.riskScore) ? CellStatusValues.Empty : val.riskScore
  }

  const heatmapSize = () => {
    const val = heatmapSummary[0].data.length || 48
    return Math.max(Math.min(val, 50), 20)
  }

  const updateRange = ({ value }: any) => {
    if (range && range.selectedValue === value) {
      return
    }
    setRange({
      selectedValue: value,
      ...getRangeDates(value)
    })
  }

  const renderTooltip = (item: any) => {
    if (isEmpty(item)) {
      return null
    }
    const roundScore = (score: number) => Math.floor(score * 1000) / 1000
    const start = moment(item.startTime).format(TOOLTIP_TIME_FORMAT)
    const end = moment(item.endTime).format(TOOLTIP_TIME_FORMAT)
    return (
      <div className={styles.heatmapTooltip}>
        <div>{`${start} - ${end}`}</div>
        <div className={styles.tooltipData}>
          Risk Score: {isUndefined(item.riskScore) && <span className={styles.tooltipMissingValue}>Missing value</span>}
          {!isUndefined(item.riskScore) && roundScore(item.riskScore)}
        </div>
      </div>
    )
  }

  return (
    <>
      <Page.Header
        title={`Service ${serviceId}`}
        toolbar={
          <Container className={styles.headingToolbar}>
            <Select defaultSelectedItem={rangeOptions[1]} items={rangeOptions} onChange={updateRange} />
          </Container>
        }
      />
      <Page.Body>
        <div className={styles.body}>
          <Layout.Horizontal spacing="small">
            <Tabs id="prod">
              <Tab
                id="prod"
                title="PRODUCTION"
                panel={
                  <div>
                    <div className={styles.panel}>
                      <Heading level={3} className={styles.panelHeading}>
                        SERVICES STATUS
                      </Heading>
                      <OverlaySpinner show={heatmapFetching}>
                        <HeatMap
                          series={heatmapSummary}
                          minValue={0}
                          maxValue={1}
                          mapValue={mapHeatmapValue}
                          renderTooltip={renderTooltip}
                          cellClassName={styles.heatmapCell}
                          rowSize={heatmapSize()}
                        />
                      </OverlaySpinner>
                    </div>
                    <div className={classnames(styles.panel, styles.shadowPanel)}>
                      <Heading level={3} className={styles.panelHeading}>
                        ACTIVITIES
                      </Heading>
                      <TimelineView
                        startDate={range.start.valueOf()}
                        endDate={range.end.valueOf()}
                        rows={timelineData}
                        renderItem={item => <div className={styles.timelineItem}>{item.label}</div>}
                      />
                    </div>
                  </div>
                }
              />
            </Tabs>
          </Layout.Horizontal>
        </div>
      </Page.Body>
    </>
  )
}

function mockTimelineData(startDate: any) {
  const timelineRows = ['Build 77', 'Build 78', 'Build 80', 'Build 85', 'Build 91', 'Build 92'].map(name => {
    const labels = ['Blue Green 20/30', 'Blue Green 60/80', 'Blue Green 10/50', 'Blue Green 50/90', 'Blue Green 80/90']
    const start = startDate.clone().add(Math.floor(Math.random() * 10) * 30, 'minutes')
    const end = start.clone().add(Math.floor(Math.random() * 10) * 30, 'minutes')
    return {
      name,
      data: [
        {
          startDate: start,
          endDate: end,
          label: labels[Math.floor(Math.random() * (labels.length - 1))]
        }
      ]
    }
  })

  return timelineRows
}
