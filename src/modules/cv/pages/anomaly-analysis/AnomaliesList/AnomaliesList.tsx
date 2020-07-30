import React, { FunctionComponent, useState } from 'react'
import { Text } from '@wings-software/uikit'
import cx from 'classnames'
import i18n from './AnomaliesList.i18n'
import css from './AnomaliesList.module.scss'

interface AnomaliesListProps {
  anomaliesList: any
  onAnomalyClick: (val: any) => void
}

const AnomaliesList: FunctionComponent<any> = (props: AnomaliesListProps) => {
  const [idSelected, setIdSelected] = useState(props.anomaliesList[0].id)

  function renderList(list: any) {
    return list.map((each: any, index: number) => {
      return (
        <div
          key={index}
          onClick={() => {
            props.onAnomalyClick(props.anomaliesList[index])
            setIdSelected(each.id)
          }}
          className={cx(css.card, {
            [css.selected]: idSelected === each.id
          })}
        >
          <div className={css.content}>
            <Text className={css.date}> {each.from} </Text>
            <Text className={css.centerRow}>
              <span className={css.duration}>
                {' '}
                {i18n.duration} {each.duration}{' '}
              </span>
              <span className={css.status}> {each.status} </span>
              <span className={css.risk}>
                {' '}
                {i18n.risk} {each.risk}{' '}
              </span>
            </Text>
            <Text className={css.bottomRow}>
              <span className={css.engine}> {each.engine} </span> |<span className={css.anomaly}> {each.anomaly} </span>{' '}
              |<span className={css.datasources}> {each.DataSources} </span>
            </Text>
          </div>
        </div>
      )
    })
  }

  return (
    <div className={css.main}>
      <div className={css.title}> {i18n.anomalies} </div>
      {renderList(props.anomaliesList)}
    </div>
  )
}

export default AnomaliesList
