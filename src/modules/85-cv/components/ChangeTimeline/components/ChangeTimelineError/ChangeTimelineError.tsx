import React from 'react'
import { Container, Text, Color } from '@wings-software/uicore'
import css from './ChangeTimelineError.module.scss'

export default function ChangeTimelineError({ error }: { error: string }): JSX.Element {
  return (
    <Container data-testid={'timelineError'} className={css.errorContainer}>
      <Text icon={'warning-sign'} iconProps={{ color: Color.RED_500, size: 16 }} font={{ size: 'medium' }}>
        {error}
      </Text>
    </Container>
  )
}
