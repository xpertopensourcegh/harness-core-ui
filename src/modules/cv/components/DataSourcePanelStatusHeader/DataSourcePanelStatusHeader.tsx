import React, { useMemo } from 'react'
import { Container, Text } from '@wings-software/uikit'
import css from './DataSourcePanelStatusHeader.module.scss'
import cx from 'classnames'

interface DataSourcePanelStatusHeaderProps {
  message?: string
  isError?: boolean
  panelName: string
}

export default function DataSourcePanelStatusHeader(props: DataSourcePanelStatusHeaderProps): JSX.Element {
  const { message, isError, panelName } = props
  const text = useMemo(() => {
    if (isError) {
      return (
        <Text width={300} intent="danger" lineClamp={1} className={cx(css.tag, css.tagError)}>
          {message}
        </Text>
      )
    }

    return (
      <Text intent="success" className={cx(css.tag, css.tagSuccess)}>
        {message}
      </Text>
    )
  }, [isError, message])
  return (
    <Container className={css.main}>
      <Text font={{ weight: 'bold' }}>{panelName}</Text>
      {message && text}
    </Container>
  )
}
