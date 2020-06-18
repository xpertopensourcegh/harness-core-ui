import React from 'react'
import { Container, Text, Color } from '@wings-software/uikit'
import css from './LogAnalysisRow.module.scss'
import i18n from '../LogAnalysisView.i18n'
import cx from 'classnames'

interface LogAnalysisRowProps {
  isColumnHeader?: boolean
}

function ColumnHeaderRow(): JSX.Element {
  return (
    <Container className={css.logRow}>
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

function DataRow(): JSX.Element {
  return (
    <Container className={cx(css.logRow, css.dataRow)}>
      <Container className={css.compareDataColumn}>
        <input type="checkbox" />
      </Container>
    </Container>
  )
}

export function LogAnalysisRow(props: LogAnalysisRowProps): JSX.Element {
  const { isColumnHeader } = props
  return (
    <Container className={css.main}>
      <Container className={css.logRow}>{isColumnHeader ? <ColumnHeaderRow /> : <DataRow />}</Container>
    </Container>
  )
}
