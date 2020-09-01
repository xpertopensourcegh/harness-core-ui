import React, { useState, useEffect, useMemo } from 'react'
import { Container, Heading, Select, OverlaySpinner } from '@wings-software/uikit'
import { Toaster, Intent } from '@blueprintjs/core'
import moment from 'moment'
import xhr from '@wings-software/xhr-async'
import { Page } from 'modules/common/exports'
import HeatMap, { CellStatusValues } from 'modules/common/components/HeatMap/HeatMap'
import TimelineView from 'modules/common/components/TimelineView/TimelineView'
import { routeParams } from 'framework/exports'
import { fetchHeatmap } from '../../services/ServicesService'
import useAnalysisDrillDownDrawer from './analysis-drilldown-view/useAnalysisDrillDownDrawer'
import styles from './CVServicesPage.module.scss'

const toaster = Toaster.create()

const rangeOptions = [
  { label: '4 hrs', value: 4 },
  { label: '12 hrs', value: 12 },
  { label: '1 day', value: 24 },
  { label: '7 days', value: 7 * 24 },
  { label: '30 days', value: 30 * 24 }
]
const defaultRange = rangeOptions[1]
const getRangeDates = (val: number) => {
  const now = moment()
  return {
    start: now.clone().subtract(val, 'hours'),
    end: now
  }
}
const defaultHeatmapData = [
  { name: 'Performance', data: [] },
  { name: 'Business', data: [] },
  { name: 'Resources', data: [] },
  { name: 'Quality', data: [] }
]

export default function CVServicesPage() {
  const [range, setRange] = useState({
    selectedValue: defaultRange.value,
    dates: {
      ...getRangeDates(defaultRange.value)
    }
  })
  const [heatmapData, setHeatmapData] = useState(defaultHeatmapData)
  const [loading, setLoading] = useState(false)
  const {
    params: { accountId, projectIdentifier },
    query: { serviceIdentifier }
  } = routeParams()
  const { openDrawer } = useAnalysisDrillDownDrawer()

  useEffect(() => {
    ;(async () => {
      setHeatmapData(defaultHeatmapData)
      setLoading(true)
      try {
        const { response, status, error } = await fetchHeatmap({
          accountId: accountId,
          envIdentifier: 'Prod',
          serviceIdentifier: serviceIdentifier as string,
          projectIdentifier: projectIdentifier as string,
          startTimeMS: range.dates.start.valueOf(),
          endTimeMS: range.dates.end.valueOf()
        })
        if (status === xhr.ABORTED) {
          return
        }
        if (status !== 200) {
          toaster.show({ intent: Intent.DANGER, timeout: 5000, message: error + '' })
          return
        }
        if (response?.resource) {
          const { resource } = response as any
          const newData = defaultHeatmapData.map(({ name }) => ({
            name,
            data: resource[name] || []
          }))
          setHeatmapData(newData)
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [range])

  const onRangeChange = ({ value }: any) => {
    if (range && range.selectedValue === value) {
      return
    }
    setRange({
      selectedValue: value,
      dates: {
        ...getRangeDates(value)
      }
    })
  }

  const mapHeatmapValue = (val: any) => {
    return val && typeof val.riskScore === 'number' ? val.riskScore : CellStatusValues.Missing
  }

  const heatMapSize = useMemo(() => {
    return Math.max(...heatmapData.map(({ data }) => data.length)) || 48
  }, [heatmapData])

  return (
    <>
      <Page.Header
        title="Services"
        toolbar={
          <Container>
            <Select defaultSelectedItem={defaultRange} items={rangeOptions} onChange={onRangeChange} />
          </Container>
        }
      />
      <Page.Body>
        <Container className={styles.servicesPage}>
          <Container className={styles.sidebar}>sidebar</Container>
          <Container className={styles.content}>
            <Container className={styles.serviceHeader}>header</Container>
            <Container className={styles.serviceBody}>
              <OverlaySpinner show={loading}>
                <Heading level={3} margin={{ bottom: 'large' }} font={{ weight: 'bold' }}>
                  Health Analysis
                </Heading>
                <HeatMap
                  series={heatmapData}
                  minValue={0}
                  maxValue={1}
                  mapValue={mapHeatmapValue}
                  renderTooltip={() => <div>tooltip</div>}
                  cellClassName={''}
                  cellShapeBreakpoint={0.5}
                  onCellClick={cell =>
                    openDrawer({
                      category: 'Performance',
                      riskScore: 89,
                      startTime: cell.startTime,
                      endTime: cell.endTime,
                      affectedMetrics: ['Throughput', 'Response Time'],
                      totalAnomalies: '5 logs and 20 metrics'
                    })
                  }
                  rowSize={heatMapSize}
                />
                <TimelineView
                  startDate={range.dates.start.valueOf()}
                  endDate={range.dates.end.valueOf()}
                  rows={[{ name: '', data: [] }]}
                  renderItem={() => <div />}
                />
              </OverlaySpinner>
            </Container>
          </Container>
        </Container>
      </Page.Body>
    </>
  )
}
