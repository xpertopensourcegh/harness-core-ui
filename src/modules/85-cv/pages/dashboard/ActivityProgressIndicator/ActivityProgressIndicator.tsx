import React, { useEffect, useState } from 'react'
import { Container, Text, Color } from '@wings-software/uicore'
import cx from 'classnames'
import type { FontProps } from '@wings-software/uicore/dist/styled-props/font/FontProps'
import CVProgressBar from '@cv/components/CVProgressBar/CVProgressBar'
import type { ActivityVerificationSummary } from 'services/cv'
import i18n from './ActivityProgressIndicator.i18n'
import css from './ActivityProgressIndicator.module.scss'

interface ActivityProgressIndicatorProps {
  data?: ActivityVerificationSummary | null
  className?: string
}

const XSMALL_FONT_SIZE: FontProps = {
  size: 'xsmall'
}

export default function ActivityProgressIndicator(props: ActivityProgressIndicatorProps): JSX.Element {
  const {
    progressPercentage: progress,
    total,
    progress: progressCount,
    passed,
    remainingTimeMs,
    startTime,
    durationMs,
    aggregatedStatus
  } = props.data || {}
  const notStarted = !props.data || aggregatedStatus === 'NOT_STARTED'
  const isInProgress = props.data && aggregatedStatus === 'IN_PROGRESS'
  const [progressValue, setProgressValue] = useState(isInProgress ? 0 : 100)
  useEffect(() => {
    if (isInProgress) {
      const timeoutRefNumber = setTimeout(() => {
        setProgressValue(Math.min(100, Math.max(0, progress!)))
        clearTimeout(timeoutRefNumber)
      }, 250)
    }
  }, [props.data])

  if (notStarted) {
    return (
      <Container className={cx(props.className, css.notStarted)}>
        <Text font={XSMALL_FONT_SIZE}>{i18n.verificationNotStarted}</Text>
        <CVProgressBar />
      </Container>
    )
  }

  const minutesRemaining = Math.floor((remainingTimeMs ?? 0) / 1000 / 60)
  const duration = Math.floor((durationMs ?? 0) / 1000 / 60)

  let progressDescription: string

  if (isInProgress) {
    progressDescription = `${i18n.inProgress} (${minutesRemaining} ${i18n.minutesRemaining})`
    if (progressCount! > 1) {
      progressDescription = `${progressCount}/${total} ${i18n.verifications} ${progressDescription}`
    }
  } else {
    progressDescription = `${passed}/${total} ${i18n.verifications} ${i18n.passedVerification}`
  }

  return (
    <Container className={props.className}>
      <Text color={progress === 100 ? undefined : Color.BLACK} font={XSMALL_FONT_SIZE}>
        {progressDescription}
      </Text>
      <CVProgressBar status={aggregatedStatus} value={progressValue} />
      <Container flex>
        {startTime !== undefined && startTime !== null && (
          <Text color={Color.GREY_300} font={XSMALL_FONT_SIZE}>
            {`${i18n.startOn} ${new Date(startTime).toLocaleString()}`}
          </Text>
        )}
        {duration !== undefined && duration !== null && (
          <Text color={Color.GREY_300} font={XSMALL_FONT_SIZE}>
            {`${duration} ${i18n.abbreviatedMinute}`}
          </Text>
        )}
      </Container>
    </Container>
  )
}
