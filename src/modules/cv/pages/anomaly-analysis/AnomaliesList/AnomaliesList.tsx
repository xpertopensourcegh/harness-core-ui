import React, { FunctionComponent } from 'react'
import { Text } from '@wings-software/uikit'
import moment from 'moment'
import cx from 'classnames'
import isEmpty from 'lodash/isEmpty'
import i18n from './AnomaliesList.i18n'
import css from './AnomaliesList.module.scss'

interface AnomaliesListProps {
  anomaliesList: Array<any>
  currentAnomaly: any
  onAnomalyClick: (val: any) => void
  isLoading: boolean
}

const getLabel = ({ startTimestamp }: any) => moment(startTimestamp).format('MMMM Do, YYYY h:mm a')
const getDuration = ({ startTimestamp, endTimestamp }: any) =>
  endTimestamp ? moment(endTimestamp).diff(startTimestamp, 'minutes') + 'mins' : ''
const trimRisk = (risk: number) => {
  const r = Math.floor(risk)
  return r + Math.floor((risk - r) * 10) / 10
}

const AnomaliesList: FunctionComponent<any> = ({
  anomaliesList = [],
  currentAnomaly,
  onAnomalyClick,
  isLoading
}: AnomaliesListProps) => {
  function renderList(list: any) {
    return list.map((each: any, index: number) => {
      return (
        <div
          key={index}
          onClick={() => {
            onAnomalyClick(anomaliesList[index])
          }}
          className={cx(css.card, {
            [css.selected]: currentAnomaly === each
          })}
        >
          <div className={css.content}>
            <Text className={css.date}> {getLabel(each)} </Text>
            <Text className={css.centerRow}>
              <span className={css.duration}>
                {' '}
                {i18n.duration} {getDuration(each)}{' '}
              </span>
              <span className={css.status}> {each.status} </span>
              <span className={css.risk}>
                {' '}
                {i18n.risk} {trimRisk(each.riskScore)}{' '}
              </span>
            </Text>
            <Text className={css.bottomRow}>
              <span className={css.service}> {each.serviceName} </span> |
              <span className={css.category}> {each.category} </span>
              {each.dataSources && (
                <span className={css.datasources}>
                  {` |`}
                  {each.dataSources}{' '}
                </span>
              )}
            </Text>
          </div>
        </div>
      )
    })
  }

  return (
    <div className={css.main}>
      <div className={css.title}> {i18n.anomalies} </div>
      <div className={css.anomalies}>{renderList(anomaliesList)}</div>
      {isEmpty(anomaliesList) && !isLoading && (
        <div className={css.noAnomaliesMsg}>No anomalies for selected range</div>
      )}
    </div>
  )
}

export default AnomaliesList
