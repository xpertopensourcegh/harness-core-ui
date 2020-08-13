import React from 'react'
import * as moment from 'moment'
import { Layout, Text, Color } from '@wings-software/uikit'
import { StringUtils } from 'modules/common/exports'
import i18n from './ConnectorStats.i18n'
import css from './ConnectorStats.module.scss'

interface ConnectorStatsProps {
  createdAt: number
  lastTested: string
  lastUpdated: number
  connectionSuccesful: string
  status: string
}
const TestStatus = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED'
}

const ConnectorStats: React.FC<ConnectorStatsProps> = props => {
  const { createdAt, lastUpdated } = props
  const nameValue = [
    {
      name: i18n.connectorCreated,
      value: createdAt ? moment.unix(createdAt / 1000).format(StringUtils.DEFAULT_DATE_FORMAT) : ''
    },
    { name: i18n.lastTested, value: props.lastTested },
    {
      name: i18n.lastUpdated,
      value: lastUpdated ? moment.unix(lastUpdated / 1000).format(StringUtils.DEFAULT_DATE_FORMAT) : ''
    },
    { name: i18n.lastConnectorSuccess, value: props.connectionSuccesful }
  ]
  return (
    <>
      <Layout.Vertical className={css.connectorStats} spacing="large">
        {nameValue.map((item, index) => {
          return (
            <Layout.Horizontal key={index} spacing="large" className={css.nameValueItem}>
              <span className={css.name}>{item.name}</span>
              <span className={css.value}>{item.value}</span>
              {item.name === i18n.lastTested ? (
                <Text
                  inline
                  icon={props.status === TestStatus.SUCCESS ? 'full-circle' : 'warning-sign'}
                  iconProps={{
                    size: 6,
                    color: props.status === TestStatus.SUCCESS ? Color.GREEN_500 : Color.RED_500
                  }}
                >
                  {props.status === TestStatus.SUCCESS ? i18n.success : i18n.failed}
                </Text>
              ) : null}
            </Layout.Horizontal>
          )
        })}
      </Layout.Vertical>
    </>
  )
}
export default ConnectorStats
