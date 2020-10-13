import React, { useState, useEffect, useMemo } from 'react'
import { Container, Text, Select, OverlaySpinner, Color, SelectOption, SelectProps } from '@wings-software/uikit'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { Page } from 'modules/common/exports'
import HeatMap, { CellStatusValues } from 'modules/common/components/HeatMap/HeatMap'
import { useRouteParams } from 'framework/exports'
import {
  HeatMapDTO,
  useGetHeatmap,
  useGetEnvServiceRisks,
  RestResponseListEnvServiceRiskDTO,
  EnvServiceRiskDTO
} from 'services/cv'
import { useToaster } from 'modules/common/exports'
import { routeCVDataSources } from 'modules/cv/routes'
import { RiskScoreTile } from 'modules/cv/components/RiskScoreTile/RiskScoreTile'
import ServiceSelector from './ServiceSelector/ServiceSelector'
import i18n from './CVServicesPage.i18n'
import { CategoryRiskCards } from '../dashboard/CategoryRiskCards/CategoryRiskCards'
import { AnalysisDrillDownView } from './analysis-drilldown-view/AnalysisDrillDownView'
import useAnalysisDrillDownView from './analysis-drilldown-view/useAnalysisDrillDownView'
import ServiceActivityTimeline from './ServiceActivityTimeline/ServiceActivityTimeline'
import styles from './CVServicesPage.module.scss'

const RangeOptions = [
  { label: i18n.timeRangeLabels.fiveMinutes, value: 5 },
  { label: i18n.timeRangeLabels.fifteenMinutes, value: 15 },
  { label: i18n.timeRangeLabels.oneHour, value: 60 },
  { label: i18n.timeRangeLabels.fourHours, value: 4 * 60 },
  { label: i18n.timeRangeLabels.twelveHours, value: 12 * 60 },
  { label: i18n.timeRangeLabels.oneDay, value: 24 * 60 },
  { label: i18n.timeRangeLabels.sevenDays, value: 7 * 24 * 60 },
  { label: i18n.timeRangeLabels.thirtyDays, value: 30 * 24 * 60 }
]
const DEFAULT_RANGE = RangeOptions[1]
const FIVE_MINUTES_IN_MILLISECONDS = 1000 * 60 * 5

const getRangeDates = (val: number) => {
  const now = moment(Math.round(new Date().getTime() / FIVE_MINUTES_IN_MILLISECONDS) * FIVE_MINUTES_IN_MILLISECONDS)
  return {
    start: now.clone().subtract(val, 'minutes'),
    end: now
  }
}

function getHeatmapCellTimeRange(heatmapData: HeatMapDTO[]): string {
  if (!heatmapData?.length) return ''
  const timeDifference = moment(heatmapData[0]?.endTime).diff(heatmapData[0]?.startTime, 'minutes')
  if (timeDifference > 60) {
    return `(${moment(heatmapData[0]?.endTime).diff(heatmapData[0]?.startTime, 'hours')} ${i18n.hours} ${
      i18n.heatmapCellTimeRangeText
    })`
  }
  return `(${timeDifference} ${i18n.minutes} ${i18n.heatmapCellTimeRangeText})`
}

function mapHeatmapValue(val: any): number | CellStatusValues {
  return val && typeof val.riskScore === 'number' ? val.riskScore : CellStatusValues.Missing
}

function HeatMapTooltip({ cell }: { cell?: HeatMapDTO }): JSX.Element {
  return cell ? (
    <Container className={styles.heatmapTooltip}>
      {cell.startTime && cell.endTime && (
        <Text>{`${moment(cell.startTime).format('M/D/YYYY h:mm a')} - ${moment(cell.endTime).format(
          'M/D/YYYY h:mm a'
        )}`}</Text>
      )}
      <Container className={styles.overallScoreContent}>
        <Text font={{ size: 'small' }}>{i18n.heatMapTooltipText.overallRiskScore}</Text>
        <RiskScoreTile riskScore={Math.floor((cell?.riskScore || 0) * 100)} isSmall />
      </Container>
    </Container>
  ) : (
    <Container className={styles.heatmapTooltip}>
      <Text className={styles.overallScoreContent}>{i18n.heatMapTooltipText.noData}</Text>
    </Container>
  )
}

export default function CVServicesPage(): JSX.Element {
  const {
    params: { accountId, projectIdentifier, orgIdentifier }
  } = useRouteParams()
  const [range, setRange] = useState({
    selectedValue: DEFAULT_RANGE.value,
    dates: {
      ...getRangeDates(DEFAULT_RANGE.value)
    }
  })
  const [heatmapData, setHeatmapData] = useState<Array<{ name: string; data: Array<any> }>>([])
  const [services, setServices] = useState<EnvServiceRiskDTO[]>([])
  const [selectedService, setSelectedService] = useState<{
    serviceIdentifier?: string
    environmentIdentifier?: string
  }>({})
  const history = useHistory()
  const { showError } = useToaster()
  const { openDrillDown } = useAnalysisDrillDownView()

  const isTimeRangeMoreThan4Hours = range.dates.end.diff(range.dates.start, 'minutes') > 4 * 60
  const { data: heatmapResponse, loading: loadingHeatmap, error: heatmapError, refetch: getHeatmap } = useGetHeatmap({
    queryParams: {
      accountId: accountId,
      envIdentifier: selectedService?.environmentIdentifier,
      serviceIdentifier: selectedService?.serviceIdentifier,
      projectIdentifier: projectIdentifier as string,
      startTimeMs: range.dates.start.valueOf(),
      endTimeMs: range.dates.end.valueOf()
    },
    lazy: true,
    resolve: response => {
      setHeatmapData(
        !response?.resource
          ? []
          : Object.keys(response.resource).map((key: string) => ({
              name: key,
              data: response?.resource[key]
            }))
      )
      return response
    }
  })

  const { loading: loadingServices, error: servicesError, refetch: refetchServices } = useGetEnvServiceRisks({
    queryParams: {
      accountId,
      projectIdentifier: projectIdentifier as string,
      orgIdentifier: orgIdentifier as string
    },
    resolve: (response: RestResponseListEnvServiceRiskDTO) => {
      if (response?.resource?.length) {
        setServices(response.resource)
        getHeatmap({
          queryParams: {
            accountId: accountId,
            projectIdentifier: projectIdentifier as string,
            startTimeMs: range.dates.start.valueOf(),
            endTimeMs: range.dates.end.valueOf()
          }
        })
      }
      return response
    }
  })

  useEffect(() => {
    if (heatmapError) showError(heatmapError.message)
  }, [heatmapResponse])

  const heatMapSize = useMemo(() => {
    return Math.max(...heatmapData.map(({ data }) => data.length)) || 48
  }, [heatmapData])

  return (
    <>
      <Page.Header title="Services" toolbar={<Container></Container>} />
      <Page.Body
        loading={loadingServices}
        noData={{
          when: () => services?.length === 0 && !servicesError?.message?.length,
          message: i18n.noDataText.noServicesConfigured,
          buttonText: i18n.noDataText.goBackToDataSourcePage,
          onClick: () => {
            history.push({
              pathname: routeCVDataSources.url({
                projectIdentifier: projectIdentifier as string,
                orgIdentifier: orgIdentifier as string
              })
            })
          },
          icon: 'error'
        }}
        error={servicesError?.message}
        retryOnError={() => {
          refetchServices()
        }}
      >
        <Container className={styles.servicesPage} background={Color.GREY_100}>
          <ServiceSelector
            className={styles.fixedServices}
            serviceData={services}
            onSelect={(envIdentifier?: string, serviceIdentifier?: string) => {
              setSelectedService({ serviceIdentifier, environmentIdentifier: envIdentifier })
              setHeatmapData([])
              refetchServices()
              if (isTimeRangeMoreThan4Hours) {
                getHeatmap({
                  queryParams: {
                    accountId: accountId,
                    projectIdentifier: projectIdentifier as string,
                    startTimeMs: range.dates.start.valueOf(),
                    endTimeMs: range.dates.end.valueOf(),
                    serviceIdentifier,
                    envIdentifier
                  }
                })
              }
            }}
          />
          <Container className={styles.content}>
            <CategoryRiskCards
              categoryRiskCardClassName={styles.categoryRiskCard}
              environmentIdentifier={selectedService?.environmentIdentifier}
              serviceIdentifier={selectedService?.serviceIdentifier}
            />
            <Container className={styles.serviceBody}>
              <Container flex>
                <Text margin={{ bottom: 'xsmall' }} font={{ size: 'small' }} color={Color.BLACK}>
                  {i18n.activityTimeline}
                </Text>
                <Select
                  defaultSelectedItem={DEFAULT_RANGE}
                  items={RangeOptions}
                  className={styles.rangeSelector}
                  size={'small' as SelectProps['size']}
                  onChange={({ value }: SelectOption) => {
                    if (range?.selectedValue === value) return
                    const selectedValue = value as number
                    setRange({ selectedValue, dates: getRangeDates(selectedValue) })
                    const { start, end } = getRangeDates(value as number)
                    if (end.diff(start, 'minutes') > 4 * 60) {
                      setHeatmapData([])
                      getHeatmap({
                        queryParams: {
                          accountId: accountId,
                          projectIdentifier: projectIdentifier as string,
                          startTimeMs: start.valueOf(),
                          endTimeMs: end.valueOf()
                        }
                      })
                    }
                  }}
                />
              </Container>
              <ServiceActivityTimeline startTime={range.dates.start.valueOf()} endTime={range.dates.end.valueOf()} />
              {isTimeRangeMoreThan4Hours ? (
                <>
                  <Text margin={{ bottom: 'xsmall' }} font={{ size: 'small' }} color={Color.BLACK}>
                    {`${i18n.heatmapSectionTitleText} ${getHeatmapCellTimeRange(heatmapData?.[0]?.data)}`}
                  </Text>
                  <OverlaySpinner show={loadingHeatmap}>
                    <HeatMap
                      series={heatmapData}
                      minValue={0}
                      maxValue={1}
                      labelsWidth={205}
                      className={styles.serviceHeatMap}
                      mapValue={mapHeatmapValue}
                      renderTooltip={(cell: HeatMapDTO) => <HeatMapTooltip cell={cell} />}
                      cellShapeBreakpoint={0.5}
                      onCellClick={(cell: HeatMapDTO, rowData) => {
                        if (cell.startTime && cell.endTime) {
                          openDrillDown({
                            categoryRiskScore: cell.riskScore ? Math.floor(cell.riskScore * 100) : 0,
                            analysisProps: {
                              startTime: cell.startTime,
                              endTime: cell.endTime,
                              categoryName: rowData?.name,
                              environmentIdentifier: selectedService?.environmentIdentifier,
                              serviceIdentifier: selectedService?.serviceIdentifier
                            }
                          })
                        }
                      }}
                      rowSize={heatMapSize}
                    />
                  </OverlaySpinner>
                </>
              ) : (
                <AnalysisDrillDownView
                  className={styles.analysisView}
                  startTime={range.dates.start.valueOf()}
                  endTime={range.dates.end.valueOf()}
                  serviceIdentifier={selectedService?.serviceIdentifier}
                  environmentIdentifier={selectedService?.environmentIdentifier}
                />
              )}
            </Container>
          </Container>
        </Container>
      </Page.Body>
    </>
  )
}
