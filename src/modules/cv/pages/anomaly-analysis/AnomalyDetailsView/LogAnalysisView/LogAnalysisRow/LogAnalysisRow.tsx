import React, { useMemo, useCallback, useState, useRef } from 'react'
import { Container, Text, Color, Icon } from '@wings-software/uikit'
import css from './LogAnalysisRow.module.scss'
import i18n from './LogAnalysisRow.i18n'
import cx from 'classnames'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import getLogAnalysisLineChartOptions from './LogAnalysisLineChartConfig'
import { LogAnalysisRiskAndJiraModal } from '../LogAnalysisRiskAndJiraModal/LogAnalysisRiskAndJiraModal'
import LogAnalysisCompareDrawer from '../LogAnalysisCompareDrawer/LogAnalysisCompareDrawer'

interface LogAnalysisRowProps {
  data: Array<{ count: number; logText: string; anomalyType: string; trendData: number[] }>
}

interface LogAnalysisDataRowProps {
  rowData: LogAnalysisRowProps['data'][0]
  onSelect: (isSelected: boolean, selectedData: LogAnalysisRowProps['data'][0], index: number) => void
  index: number
  isSelected: boolean
}

interface FeedbackColumnProps {
  feedback?: { risk: string; message?: string }
  onClickColumn: () => void
}

function ColumnHeaderRow(): JSX.Element {
  return (
    <Container className={cx(css.mainRow, css.columnHeader)}>
      <Text color={Color.BLACK} className={css.logRowColumnHeader}>
        {i18n.logAnalaysisTableColumns.compare}
      </Text>
      <Text color={Color.BLACK} className={css.logRowColumnHeader}>
        {i18n.logAnalaysisTableColumns.anomalyType}
      </Text>
      <Text color={Color.BLACK} className={css.logRowColumnHeader}>
        {i18n.logAnalaysisTableColumns.feedback}
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

function FeedbackColumn(props: FeedbackColumnProps): JSX.Element {
  const { feedback, onClickColumn } = props

  const riskColor = useMemo(() => {
    if (!feedback || !feedback.risk) {
      return
    }
    const { risk } = feedback
    switch (risk) {
      case 'P1':
        return Color.RED_600
      case 'P2':
        return Color.ORANGE_500
      case 'P3':
        return Color.YELLOW_500
      case 'P4':
        return Color.GREEN_400
      case 'P5':
        return Color.GREEN_600
    }
  }, [feedback])
  if (!feedback) {
    return (
      <Container className={cx(css.dataColumn, css.noFeedback, css.openModalColumn)} onClick={onClickColumn}>
        <Icon name="no-feedback-given" size={22} style={{ position: 'relative', bottom: '4px' }} />
      </Container>
    )
  }

  return (
    <Text
      icon="feedback-given"
      iconProps={{ size: 20, margin: { right: 'xsmall' }, padding: { right: 0 } }}
      tooltip={feedback.message ?? undefined}
      className={cx(css.dataColumn, css.openModalColumn)}
      color={riskColor}
      onClick={onClickColumn}
    >
      {feedback.risk}
    </Text>
  )
}

function DataRow(props: LogAnalysisDataRowProps): JSX.Element {
  const { onSelect, rowData, index, isSelected } = props
  const chartOptions = useMemo(() => getLogAnalysisLineChartOptions(), [])
  const [displayRiskEditModal, setDisplayRiskEditModal] = useState(false)
  const [feedbackGiven, setFeedbackGiven] = useState<{ risk: string; message: string } | undefined>(undefined)
  const logTextRef = useRef<HTMLParagraphElement>(null)
  const onCheckCallback = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSelect?.(e.currentTarget.checked, rowData, index)
    },
    [onSelect, index, rowData]
  )
  const onHideRiskEditModalCallback = useCallback((data?: any) => {
    if (data?.risk || data?.message) {
      setFeedbackGiven(data)
    }
    setDisplayRiskEditModal(false)
  }, [])
  const onShowRiskEditModalCallback = useCallback(() => setDisplayRiskEditModal(true), [])

  return (
    <Container className={cx(css.mainRow, css.dataRow, css.highlightRow)}>
      <Container className={cx(css.compareDataColumn, css.dataColumn)}>
        <input type="checkbox" checked={isSelected} onChange={onCheckCallback} />
      </Container>
      <Text className={cx(css.logRowText, css.dataColumn, css.openModalColumn)} onClick={onShowRiskEditModalCallback}>
        {rowData?.anomalyType}
      </Text>
      <FeedbackColumn feedback={feedbackGiven} onClickColumn={onShowRiskEditModalCallback} />
      <Container className={cx(css.logText, css.dataColumn, css.openModalColumn)} onClick={onShowRiskEditModalCallback}>
        <p className={css.logRowText} ref={logTextRef}>
          {rowData?.logText}
        </p>
      </Container>
      <Text className={cx(css.dataColumn, css.logRowText, css.openModalColumn)} onClick={onShowRiskEditModalCallback}>
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
          logMessage={rowData.logText}
          feedback={feedbackGiven}
        />
      ) : undefined}
    </Container>
  )
}

export function LogAnalysisRow(props: LogAnalysisRowProps): JSX.Element {
  const { data = [] } = props
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
  const selectedRowData = useMemo(
    () =>
      dataToCompare.map(({ data: selectedData }) => ({ ...selectedData, trendData: getLogAnalysisLineChartOptions() })),
    [dataToCompare]
  )

  return (
    <Container className={css.main}>
      <ColumnHeaderRow />
      <Container className={css.dataContainer}>
        {data.map((row, index) => (
          <DataRow
            key={`${row.anomalyType}-${row.count}-${row.logText}`}
            rowData={row}
            index={index}
            onSelect={onCompareSelectCallback}
            isSelected={selectedIndices.has(index)}
          />
        ))}
      </Container>
      {displayCompareDataModal && (
        <LogAnalysisCompareDrawer rowsToCompare={selectedRowData} onHide={() => setDisplayCompareDataModal(false)} />
      )}
    </Container>
  )
}
