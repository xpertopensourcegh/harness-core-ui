import React, { useMemo, useCallback, useState, useRef } from 'react'
import { Container, Text, Color, Icon, Heading, useExpandibleHook } from '@wings-software/uikit'
import css from './LogAnalysisRow.module.scss'
import i18n from './LogAnalysisRow.i18n'
import cx from 'classnames'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import getLogAnalysisLineChartOptions from './LogAnalysisLineChartConfig'
import { Dialog } from '@blueprintjs/core'
import LogAnalysisRiskAndJiraModal from '../LogAnalysisRiskAndJiraModal/LogAnalysisRiskAndJiraModal'

interface LogAnalysisRowProps {
  data: Array<{ count: number; logText: string; anomalyType: string; trendData: number[] }>
  environment: string
  service: string
  startTime: number
  endTime: number
}

interface LogAnalysisDataRowProps {
  rowData: LogAnalysisRowProps['data'][0]
  onSelect: (isSelected: boolean, selectedData: LogAnalysisRowProps['data'][0], index: number) => void
  index: number
  isSelected: boolean
  environment: string
  service: string
  startTime: number
  endTime: number
}

interface CompareAndExpandColumnProps {
  isSelected: boolean
  onCheckCallback: (e: React.ChangeEvent<HTMLInputElement>) => void
  onExpand: (isExpanded: boolean) => void
  isExpandible: boolean
}

function ColumnHeaderRow(): JSX.Element {
  return (
    <Container className={cx(css.main, css.columnHeader)}>
      <Text color={Color.BLACK} className={css.logRowColumnHeader}>
        {i18n.logAnalaysisTableColumns.compare}
      </Text>
      <Text color={Color.BLACK} className={css.logRowColumnHeader}>
        {i18n.logAnalaysisTableColumns.anomalyType}
      </Text>
      <Text color={Color.BLACK} className={css.logRowColumnHeader}>
        {i18n.logAnalaysisTableColumns.risk}
      </Text>
      <Text color={Color.BLACK} className={css.logRowColumnHeader}>
        {i18n.logAnalaysisTableColumns.sampleEvents}
      </Text>
      <Text color={Color.BLACK} className={css.logRowColumnHeader}>
        {i18n.logAnalaysisTableColumns.count}
      </Text>
      <Text color={Color.BLACK} className={css.logRowColumnHeader}>
        {i18n.logAnalaysisTableColumns.trend}
      </Text>
    </Container>
  )
}

function CompareAndExpandColumn(props: CompareAndExpandColumnProps): JSX.Element {
  const { isSelected, onCheckCallback, onExpand, isExpandible } = props
  const [isExpanded, setExpanded] = useState(false)
  const onExpandClickCallback = useCallback(() => {
    setExpanded(!isExpanded)
    onExpand(!isExpanded)
  }, [isExpanded, onExpand])
  return (
    <Container className={cx(css.compareDataColumn, css.dataColumn)}>
      <input type="checkbox" checked={isSelected} onChange={onCheckCallback} />
      {isExpandible ? (
        <Icon
          size={11}
          name={isExpanded ? 'main-chevron-down' : 'main-chevron-right'}
          onClick={onExpandClickCallback}
        />
      ) : undefined}
    </Container>
  )
}

function DataRow(props: LogAnalysisDataRowProps): JSX.Element {
  const { onSelect, rowData, index, isSelected, environment, service, startTime, endTime } = props
  const chartOptions = useMemo(() => getLogAnalysisLineChartOptions(), [])
  const [displayRiskEditModal, setDisplayRiskEditModal] = useState(false)
  const [expandText, setExpandText] = useState(false)
  const logTextRef = useRef<HTMLParagraphElement>(null)
  const isExpandible = useExpandibleHook(logTextRef)
  const onCheckCallback = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSelect?.(e.currentTarget.checked, rowData, index)
    },
    [onSelect, index, rowData]
  )
  const onHideRiskEditModalCallback = useCallback(() => setDisplayRiskEditModal(false), [])
  const onShowRiskEditModalCallback = useCallback(() => setDisplayRiskEditModal(true), [])
  const onExpandIconClickCallback = useCallback((shouldExpand: boolean) => setExpandText(shouldExpand), [])

  return (
    <Container className={cx(css.main, css.dataRow)}>
      <CompareAndExpandColumn
        isSelected={isSelected}
        onCheckCallback={onCheckCallback}
        onExpand={onExpandIconClickCallback}
        isExpandible={isExpandible}
      />
      <Text className={cx(css.logRowText, css.dataColumn, css.borderedColumn)}>{rowData?.anomalyType}</Text>
      <Container className={css.dataColumn}>
        <Icon name="service-jira" size={11} />
      </Container>
      <Container className={cx(css.logText, css.dataColumn)} onClick={onShowRiskEditModalCallback}>
        <p className={css.logRowText} data-collapsed={!expandText} ref={logTextRef}>
          {rowData?.logText}
        </p>
      </Container>
      <Text className={cx(css.borderedColumn, css.dataColumn, css.logRowText)} onClick={onShowRiskEditModalCallback}>
        {rowData?.count}
      </Text>
      <Container className={cx(css.lineChartContainer, css.dataColumn)}>
        <HighchartsReact highchart={Highcharts} options={chartOptions} />
      </Container>
      {displayRiskEditModal ? (
        <LogAnalysisRiskAndJiraModal
          onHide={onHideRiskEditModalCallback}
          trendData={chartOptions}
          count={rowData.count}
          activityType={rowData.anomalyType}
          environment={environment}
          service={service}
          logMessage={rowData.logText}
          endTime={endTime}
          startTime={startTime}
        />
      ) : undefined}
    </Container>
  )
}

export function LogAnalysisRow(props: LogAnalysisRowProps): JSX.Element {
  const { data = [], environment, service, startTime, endTime } = props
  const [displayCompareDataModal, setDisplayCompareDataModal] = useState(false)
  const [dataToCompare, setDataToCompare] = useState<Array<{ data: LogAnalysisRowProps['data'][0]; index: number }>>([])
  const onCompareSelectCallback = useCallback(
    (isSelect: boolean, selectedData: LogAnalysisRowProps['data'][0], index: number) => {
      let updatedDataToCompare = [...dataToCompare]
      if (!isSelect) {
        updatedDataToCompare = updatedDataToCompare.filter(d => d.index !== index)
      } else if (updatedDataToCompare.length !== 2) {
        updatedDataToCompare.unshift({ data: selectedData, index })
      } else {
        updatedDataToCompare.pop()
        updatedDataToCompare.unshift({ data: selectedData, index })
      }

      if (updatedDataToCompare?.length === 2) {
        setDisplayCompareDataModal(true)
      }
      setDataToCompare(updatedDataToCompare)
    },
    [dataToCompare]
  )
  const selectedIndices = useMemo(() => new Set(dataToCompare.map(d => d.index)), [dataToCompare])

  return (
    <Container>
      <ColumnHeaderRow />
      {data.map((row, index) => (
        <DataRow
          key={`${row.anomalyType}-${row.count}-${row.logText}`}
          rowData={row}
          index={index}
          onSelect={onCompareSelectCallback}
          isSelected={selectedIndices.has(index)}
          environment={environment}
          service={service}
          startTime={startTime}
          endTime={endTime}
        />
      ))}
      {displayCompareDataModal && (
        <Dialog onClose={() => setDisplayCompareDataModal(false)} isOpen={true}>
          <Heading>Modal to compare two log messages</Heading>
        </Dialog>
      )}
    </Container>
  )
}
