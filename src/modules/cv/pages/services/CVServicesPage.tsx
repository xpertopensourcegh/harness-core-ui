import React, { useState, useEffect, useMemo } from 'react'
import { Container, Heading, Select, OverlaySpinner } from '@wings-software/uikit'
import moment from 'moment'
import { flatten } from 'lodash-es'
import { Page } from 'modules/common/exports'
import HeatMap, { CellStatusValues } from 'modules/common/components/HeatMap/HeatMap'
import TimelineView from 'modules/common/components/TimelineView/TimelineView'
import { routeParams } from 'framework/exports'
import { useGetServices, HeatMapDTO, useGetHeatmap } from 'services/cv'
import { useToaster } from 'modules/common/exports'
import ServiceSelector from './ServiceSelector'
import useAnalysisDrillDownDrawer from './analysis-drilldown-view/useAnalysisDrillDownDrawer'
import i18n from './CVServicesPage.i18n'
import styles from './CVServicesPage.module.scss'

const rangeOptions = [
  { label: '4 hrs', value: 4 },
  { label: '12 hrs', value: 12 },
  { label: '1 day', value: 24 },
  { label: '7 days', value: 7 * 24 },
  { label: '30 days', value: 30 * 24 }
]
const defaultRange = rangeOptions[0]
const getRangeDates = (val: number) => {
  const now = moment()
  return {
    start: now.clone().subtract(val, 'hours'),
    end: now
  }
}

interface ServiceData {
  identifier: string
  name: string
  environment: string
}

export default function CVServicesPage() {
  const [range, setRange] = useState({
    selectedValue: defaultRange.value,
    dates: {
      ...getRangeDates(defaultRange.value)
    }
  })
  const [heatmapData, setHeatmapData] = useState<Array<{ name: string; data: Array<any> }>>([])
  const [services, setServices] = useState<Array<ServiceData>>([])
  const [selectedService, setSelectedService] = useState<ServiceData | undefined>()
  const {
    params: { accountId, projectIdentifier, orgIdentifier }
  } = routeParams()
  const { openDrawer } = useAnalysisDrillDownDrawer()
  const { showError } = useToaster()

  const onSelectService = (id: string) => {
    const service = services.find(s => s.identifier === id)
    if (service) {
      setSelectedService(service)
    }
  }

  const { data: servicesResponse, loading, error: servicesError } = useGetServices({
    queryParams: {
      accountId,
      projectIdentifier: projectIdentifier as string,
      orgIdentifier: orgIdentifier as string
    }
  })

  useEffect(() => {
    if (!loading) {
      if (servicesError) {
        showError(servicesError.message)
        return
      }
      let serviceItems = servicesResponse?.resource?.map((item: any) => {
        return item.services.map((service: any) => ({
          ...service,
          environment: item.environment.name
        }))
      })
      serviceItems = flatten(serviceItems)
      setServices(serviceItems)
      setSelectedService(serviceItems[0])
    }
  }, [servicesResponse])

  const { data: heatmapResponse, loading: loadingHeatmap, error: heatmapError, refetch: getHeatmap } = useGetHeatmap({
    queryParams: {
      accountId: accountId,
      envIdentifier: selectedService?.environment,
      serviceIdentifier: selectedService?.identifier,
      projectIdentifier: projectIdentifier as string,
      startTimeMs: range.dates.start.valueOf(),
      endTimeMs: range.dates.end.valueOf()
    },
    lazy: true
  })

  useEffect(() => {
    if (selectedService) {
      setHeatmapData([])
      getHeatmap()
    }
  }, [range, selectedService])

  useEffect(() => {
    if (!loadingHeatmap) {
      if (heatmapError) {
        showError(heatmapError.message)
        return
      }
      const resource = heatmapResponse?.resource as any
      setHeatmapData(
        !resource
          ? []
          : Object.keys(resource).map((key: string) => ({
              name: key,
              data: resource[key]
            }))
      )
    }
  }, [heatmapResponse])

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
      <Page.Body loading={loading}>
        <Container className={styles.servicesPage}>
          <Container className={styles.sidebar}>
            <ServiceSelector
              services={services}
              selectedServiceId={selectedService && selectedService!.identifier}
              onSelect={onSelectService}
            />
          </Container>
          <Container className={styles.content}>
            <Container className={styles.serviceHeader}>Header</Container>
            <Container className={styles.serviceBody}>
              <OverlaySpinner show={loadingHeatmap}>
                <Heading level={3} margin={{ bottom: 'large' }} font={{ weight: 'bold' }}>
                  {i18n.healthAnalysis}
                </Heading>
                <HeatMap
                  series={heatmapData}
                  minValue={0}
                  maxValue={1}
                  mapValue={mapHeatmapValue}
                  renderTooltip={(cell: HeatMapDTO) => <div>{cell && cell.riskScore}</div>}
                  cellClassName={''}
                  cellShapeBreakpoint={0.5}
                  onCellClick={(cell: HeatMapDTO) =>
                    openDrawer({
                      category: 'Performance',
                      riskScore: 89,
                      startTime: cell.startTime as number,
                      endTime: cell.endTime as number,
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
