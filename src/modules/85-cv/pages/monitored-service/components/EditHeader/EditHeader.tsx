import React from 'react'
import { Container, Text } from '@wings-software/uicore'
import moment from 'moment'
import type { EditHeaderProps } from './EditHeader.types'
import css from './EditHeader.module.scss'

export default function EditHeader(props: EditHeaderProps): JSX.Element {
  const { monitoredServiceData, lastModifiedAt } = props
  return (
    <Container className={css.container}>
      <Container className={css.leftContainer}>
        <Text font={{ size: 'medium', weight: 'bold' }}>{monitoredServiceData?.name}</Text>
        <Text
          font={{ size: 'small' }}
          padding={{ left: 'medium', top: 'xsmall' }}
        >{`ID: ${monitoredServiceData?.identifier}`}</Text>
      </Container>
      <Container className={css.rightContainer}>
        <Text font={{ size: 'small' }}>{`Last updated: ${moment(lastModifiedAt).format(
          'MM/DD/YYYY hh:mm:ss a'
        )}`}</Text>
        <Text
          font={{ size: 'small' }}
          padding={{ top: 'small' }}
        >{`Environment: ${monitoredServiceData?.environmentRef}`}</Text>
      </Container>
    </Container>
  )
}
