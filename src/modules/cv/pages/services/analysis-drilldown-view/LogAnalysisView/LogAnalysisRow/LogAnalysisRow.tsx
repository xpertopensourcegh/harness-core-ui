import React, { useMemo, useCallback, useState, useRef } from 'react'
import { Container, Text, Color, Icon } from '@wings-software/uikit'
import cx from 'classnames'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import type { Frequency, LogData } from 'services/cv'
import i18n from './LogAnalysisRow.i18n'
import getLogAnalysisLineChartOptions from './LogAnalysisLineChartConfig'
import { LogAnalysisRiskAndJiraModal } from '../LogAnalysisRiskAndJiraModal/LogAnalysisRiskAndJiraModal'
// import LogAnalysisCompareDrawer from '../LogAnalysisCompareDrawer/LogAnalysisCompareDrawer'
import css from './LogAnalysisRow.module.scss'

interface LogAnalysisRowProps {
  data: LogData[]
  startTime: number
  endTime: number
}

interface LogAnalysisDataRowProps {
  rowData: LogAnalysisRowProps['data'][0]
  onSelect: (
    isSelected: boolean,
    selectedData: LogAnalysisRowProps['data'][0],
    index: number,
    chartOptions: Highcharts.Options
  ) => void
  index: number
  isSelected: boolean
  startTime: number
  endTime: number
}

type CompareLogEventsInfo = {
  data: LogAnalysisRowProps['data'][0]
  index: number
  trendLineOptions: Highcharts.Options
}

function generatePointsForTimeSeries(
  trend: Frequency[],
  startTime: number,
  endTime: number
): Highcharts.SeriesLineOptions['data'] {
  if (!trend || !Object.keys(trend).length) {
    return []
  }

  trend.sort((trendDataA, trendDataB) => {
    if (!trendDataA?.timestamp) {
      return trendDataB?.timestamp ? -1 : 0
    }
    if (!trendDataB?.timestamp) {
      return trendDataA.timestamp
    }

    return trendDataA.timestamp - trendDataB.timestamp
  })

  const filledMetricData = []
  let trendIndex = 0
  for (let currTime = startTime; currTime <= endTime; currTime += 60000) {
    if (trend[trendIndex]?.timestamp === currTime) {
      filledMetricData.push({ x: currTime, y: trend[trendIndex]?.count })
      trendIndex++
    } else {
      filledMetricData.push({ x: currTime, y: 0 })
    }
  }

  return filledMetricData
}

function getEventTypeFromTag(tag: LogData['tag']): string {
  switch (tag) {
    case 'KNOWN':
      return i18n.eventType.known
    case 'UNKNOWN':
      return i18n.eventType.unknown
    case 'UNEXPECTED':
      return i18n.eventType.unexpected
    default:
      return ''
  }
}

function ColumnHeaderRow(): JSX.Element {
  return (
    <Container className={cx(css.mainRow, css.columnHeader)}>
      <Text color={Color.BLACK} className={css.logRowColumnHeader} margin={{ left: 'large' }}>
        {i18n.logAnalaysisTableColumns.clusterType}
      </Text>
      <Text color={Color.BLACK} className={css.logRowColumnHeader}>
        {i18n.logAnalaysisTableColumns.sampleMessage}
      </Text>
      <Text color={Color.BLACK} className={css.logRowColumnHeader}>
        {i18n.logAnalaysisTableColumns.count}
      </Text>
      <Text color={Color.BLACK} className={css.logRowColumnHeader}>
        {i18n.logAnalaysisTableColumns.messageFrequency}
      </Text>
      <Text color={Color.BLACK} className={css.logRowColumnHeader}>
        {i18n.logAnalaysisTableColumns.actions}
      </Text>
    </Container>
  )
}

function DataRow(props: LogAnalysisDataRowProps): JSX.Element {
  const { onSelect, rowData, index, isSelected, startTime, endTime } = props
  const chartOptions = useMemo(() => {
    return getLogAnalysisLineChartOptions(generatePointsForTimeSeries(rowData.trend || [], startTime, endTime))
  }, [rowData.trend, startTime, endTime])
  const [displayRiskEditModal, setDisplayRiskEditModal] = useState(false)
  const [feedbackGiven, setFeedbackGiven] = useState<{ risk: string; message: string } | undefined>(undefined)
  const logTextRef = useRef<HTMLParagraphElement>(null)
  const onShowRiskEditModalCallback = useCallback(() => setDisplayRiskEditModal(true), [])
  const onHideRiskEditModalCallback = useCallback((data?: any) => {
    if (data?.risk || data?.message) setFeedbackGiven(data)
    setDisplayRiskEditModal(false)
  }, [])

  return (
    <Container className={cx(css.mainRow, css.dataRow, css.highlightRow)}>
      <Container className={cx(css.dataColumn, css.openModalColumn, css.compareDataColumn)}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onSelect?.(e.currentTarget.checked, rowData, index, chartOptions)
          }}
        />
        {rowData.tag && <Text onClick={onShowRiskEditModalCallback}>{getEventTypeFromTag(rowData.tag)}</Text>}
      </Container>
      <Container className={cx(css.logText, css.dataColumn, css.openModalColumn)} onClick={onShowRiskEditModalCallback}>
        <p className={css.logRowText} ref={logTextRef}>
          {rowData.text}
        </p>
      </Container>
      <Text className={cx(css.dataColumn, css.logRowText, css.openModalColumn)} onClick={onShowRiskEditModalCallback}>
        {rowData.count}
      </Text>
      <Container className={cx(css.lineChartContainer, css.dataColumn)}>
        <HighchartsReact highchart={Highcharts} options={chartOptions} />
      </Container>
      <Container className={cx(css.actions, css.dataColumn)}>
        <Icon name="service-jira" margin={{ right: 'small' }} />
        <Icon name="share" />
      </Container>
      {displayRiskEditModal ? (
        <LogAnalysisRiskAndJiraModal
          onHide={onHideRiskEditModalCallback}
          trendData={chartOptions}
          count={rowData.count || 0}
          activityType={rowData.tag}
          logMessage={rowData.text || ''}
          feedback={feedbackGiven}
        />
      ) : undefined}
    </Container>
  )
}

export function LogAnalysisRow(props: LogAnalysisRowProps): JSX.Element {
  const { data = [], startTime, endTime } = props
  // const [displayCompareDataModal, setDisplayCompareDataModal] = useState(false)
  const [dataToCompare, setDataToCompare] = useState<CompareLogEventsInfo[]>([])
  const onCompareSelectCallback = useCallback(
    (isSelect: boolean, selectedData: LogData, index: number, trendLineOptions: Highcharts.Options) => {
      let updatedDataToCompare = [...dataToCompare]
      if (!isSelect) {
        updatedDataToCompare = updatedDataToCompare.filter(d => d.index !== index)
      } else {
        if (updatedDataToCompare.length === 2) updatedDataToCompare.pop()
        updatedDataToCompare.unshift({ data: selectedData, index, trendLineOptions })
      }

      // if (updatedDataToCompare?.length === 2) setDisplayCompareDataModal(true)
      setDataToCompare(updatedDataToCompare)
    },
    [dataToCompare]
  )
  const selectedIndices = useMemo(() => new Set(dataToCompare.map(d => d.index)), [dataToCompare])
  // const selectedRowData = useMemo(
  //   () => dataToCompare.map(({ data: selectedData, trendLineOptions }) => ({ ...selectedData, trendLineOptions })),
  //   [dataToCompare]
  // )

  return (
    <Container className={css.main}>
      <ColumnHeaderRow />
      <Container className={css.dataContainer}>
        {data.map((row, index) => {
          if (!row) return undefined
          const { tag, count, label, text } = row
          return (
            <DataRow
              key={`${tag}-${count}-${label}-${text}`}
              rowData={row}
              index={index}
              startTime={startTime}
              endTime={endTime}
              onSelect={onCompareSelectCallback}
              isSelected={selectedIndices.has(index)}
            />
          )
        })}
      </Container>
      {/* {displayCompareDataModal && (
        <LogAnalysisCompareDrawer rowsToCompare={undefined} onHide={() => setDisplayCompareDataModal(false)} />
      )} */}
    </Container>
  )
}
