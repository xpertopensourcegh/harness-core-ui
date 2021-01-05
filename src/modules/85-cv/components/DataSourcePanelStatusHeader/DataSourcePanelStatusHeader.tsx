import React, { useMemo } from 'react'
import { Container, Text, Intent } from '@wings-software/uicore'
import cx from 'classnames'
import css from './DataSourcePanelStatusHeader.module.scss'

interface DataSourcePanelStatusHeaderProps {
  message?: string
  intent?: Intent
  panelName: string | JSX.Element
}

export default function DataSourcePanelStatusHeader(props: DataSourcePanelStatusHeaderProps): JSX.Element {
  const { message, panelName, intent } = props
  const text = useMemo(() => {
    if (intent === 'danger') {
      return (
        <Text intent="danger" lineClamp={1} width={170} className={cx(css.tag, css.tagError)}>
          {message}
        </Text>
      )
    }

    let style = css.tagSuccess
    if (intent === 'primary') {
      style = css.tagEditing
    } else if (intent === 'none') {
      style = css.tagUnsavedChanges
    }

    return (
      <Text intent={intent} lineClamp={1} className={cx(css.tag, style)}>
        {message}
      </Text>
    )
  }, [intent, message])
  return (
    <Container className={css.main}>
      <Container className={css.title}>
        {typeof panelName === 'string' ? (
          <Text font={{ weight: 'bold' }} lineClamp={1} className={css.panelName}>
            {panelName}
          </Text>
        ) : (
          panelName
        )}
      </Container>
      {message && text}
    </Container>
  )
}
