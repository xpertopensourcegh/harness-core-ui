import React, { FunctionComponent } from 'react'
import { Tag, Intent } from '@wings-software/uikit'
import moment from 'moment'
import i18n from './AnomaliesHeader.i18n'
import css from './AnomaliesHeader.module.scss'

interface AnomaliesHeaderProps {
  details: any
}

const AnomaliesHeader: FunctionComponent<any> = (props: AnomaliesHeaderProps) => {
  return (
    <div className={css.main}>
      <div className={css.header}>
        <strong className={css.title}> {props.details.name} </strong>
        <span className={css.small}>
          {' '}
          {i18n.from}
          <strong className={css.title}>{moment(props.details.from).format('MMMM Do, YYYY h:mm a')}</strong>{' '}
        </span>
        <span className={css.small}>
          {' '}
          {i18n.to}
          <strong className={css.title}>{moment(props.details.to).format('MMMM Do, YYYY h:mm a')}</strong>{' '}
        </span>
        <span className={css.danger}>
          {' '}
          {i18n.overallRiskScore}: {props.details.riskScore}{' '}
        </span>
      </div>
      <div className={css.body}>
        <div>
          <div className={css.title}>{i18n.activityType}</div>
          <div className={css.detail}>{props.details.activityType}</div>
        </div>

        <div>
          <div className={css.title}>{i18n.activityIdentifier}</div>
          <div className={css.detail}>{props.details.activityIdentifier}</div>
        </div>

        <div>
          <div className={css.title}>{i18n.environment}</div>
          <div className={css.detail}>{props.details.environment}</div>
        </div>

        <div>
          <div className={css.title}>{i18n.service}</div>
          <div className={css.detail}>{props.details.service}</div>
        </div>

        <div>
          <div className={css.title}>{i18n.activityDetail}</div>
          <div className={css.detail}>
            {props.details.activityDetail.map((each: string, index: number) => {
              return (
                <span className={css.tag} key={index}>
                  {' '}
                  <Tag intent={Intent.PRIMARY} minimal={true}>
                    {' '}
                    {each}{' '}
                  </Tag>{' '}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnomaliesHeader
