import React from 'react'
import { Container, Text } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import css from '../TimelineRow.module.scss'

export default function TimelineRowNoData({ noDataMessage }: { noDataMessage: string }): JSX.Element {
  const { getString } = useStrings()
  return (
    <Container data-testid={'timelineNoData'} className={css.noDataContainer}>
      <Text font={{ size: 'xsmall' }}>{noDataMessage || getString('noData')}</Text>
    </Container>
  )
}
