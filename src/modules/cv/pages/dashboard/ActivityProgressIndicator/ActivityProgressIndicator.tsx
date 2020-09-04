import React, { useEffect, useState } from 'react'
import { Container, Text, Color } from '@wings-software/uikit'
import { ProgressBar, Intent } from '@blueprintjs/core'
import cx from 'classnames'
import type { FontProps } from '@wings-software/uikit/dist/styled-props/font/FontProps'
import i18n from './ActivityProgressIndicator.i18n'
import css from './ActivityProgressIndicator.module.scss'

interface ActivityProgressIndicatorProps {
  progress: number
  startTime?: number
  passedVerifications?: string
  minutesRemaining?: number
  duration?: number
  status?: Intent
  className?: string
}

const XSMALL_FONT_SIZE: FontProps = {
  size: 'xsmall'
}

export default function ActivityProgressIndicator(props: ActivityProgressIndicatorProps): JSX.Element {
  const { progress, startTime, passedVerifications, minutesRemaining, duration, status, className } = props
  const [progressValue, setProgressValue] = useState(0)
  const isValidProgressValue = progress !== undefined && progress !== null && progress > -1
  useEffect(() => {
    if (isValidProgressValue) {
      const timeoutRefNumber = setTimeout(() => {
        setProgressValue(progress / 100)
        clearTimeout(timeoutRefNumber)
      }, 250)
    }
  }, [progress, isValidProgressValue])

  if (!isValidProgressValue) {
    return (
      <Container className={cx(className, css.notStarted)}>
        <Text font={XSMALL_FONT_SIZE}>{i18n.verificationNotStarted}</Text>
        <ProgressBar stripes={false} intent="none" className={css.progressBar} />
      </Container>
    )
  }

  let progressDescription = `${passedVerifications} ${i18n.verificationsInProgress} (${minutesRemaining} ${i18n.minutesRemaining})`
  if (progress === 100) {
    progressDescription = `${passedVerifications} ${i18n.verifications} ${i18n.passedVerification}`
  }

  return (
    <Container className={className}>
      <Text color={progress === 100 ? undefined : Color.BLACK} font={XSMALL_FONT_SIZE}>
        {progressDescription}
      </Text>
      <ProgressBar intent={status} value={progressValue} stripes={false} className={css.progressBar} />
      <Container flex>
        {startTime !== undefined && startTime !== null && (
          <Text color={Color.GREY_300} font={XSMALL_FONT_SIZE}>
            {`${i18n.startOn} ${new Date(startTime).toLocaleString()}`}
          </Text>
        )}
        {duration !== undefined && duration !== null && (
          <Text color={Color.GREY_300} font={XSMALL_FONT_SIZE}>
            {duration}
          </Text>
        )}
      </Container>
    </Container>
  )
}
