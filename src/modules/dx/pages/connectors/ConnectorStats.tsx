import React from 'react'
import css from './ConnectorStats.module.scss'
import { Layout, Button, Text, Color } from '@wings-software/uikit'
import i18n from './ConnectorStats.i18n'

interface ConnectorStatsProps {
  createdAt: string
  lastTested: string
  lastUpdated: string
  connectionSuccesful: string
  status: string
}
const TestStatus = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED'
}

const testConnection = () => {
  return <Button className={css.testBtn} text={i18n.testConnection} onClick={() => alert('TBD: Test Connection')} />
}

const ConnectorStats = (props: ConnectorStatsProps) => {
  const nameValue = [
    { name: i18n.connectorCreated, value: props.createdAt },
    { name: i18n.lastTested, value: props.lastTested },
    { name: i18n.lastUpdated, value: props.lastUpdated },
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
                    // style: { marginTop: cell.row.original?.status === 'ACTIVE' ? 5 : 3 },
                    color:props.status === TestStatus.SUCCESS  ? Color.GREEN_500 : Color.RED_500
                  }}
                  // className={css.status}
                >{props.status === TestStatus.SUCCESS?i18n.success:i18n.failed}</Text>
              ) : null}
            </Layout.Horizontal>
          )
        })}
        {testConnection()}
      </Layout.Vertical>
    </>
  )
}
export default ConnectorStats
