import React from 'react'
import moment from 'moment'
import { Container, Layout, Text } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import { durationAsString } from './DeploymentTimeDuration.utils'
import { TIME_FORMAT } from './DeploymentTimeDuration.constant'
import css from './DeploymentTimeDuration.module.scss'

export default function DeploymentTimeDuration({ startTime, endTime }: { startTime: number; endTime: number }) {
  const { getString } = useStrings()
  const durationString = durationAsString(startTime, endTime)
  const timePassed = durationAsString(endTime, moment().valueOf())

  return (
    <Container className={css.main}>
      <Layout.Horizontal flex={{ justifyContent: 'space-between' }}>
        <Text icon={'time'} iconProps={{ size: 12 }} font={{ size: 'xsmall' }}>
          {getString('cv.changeSource.changeSourceCard.finished')}
          {moment(endTime).format(TIME_FORMAT)}
        </Text>
        <Text icon={'time'} iconProps={{ size: 12 }} font={{ size: 'xsmall' }}>
          {getString('common.durationPrefix')}
          {durationString}
        </Text>
        <Text icon={'calendar'} iconProps={{ size: 12 }} font={{ size: 'xsmall' }}>
          {timePassed}
        </Text>
      </Layout.Horizontal>
    </Container>
  )
}
