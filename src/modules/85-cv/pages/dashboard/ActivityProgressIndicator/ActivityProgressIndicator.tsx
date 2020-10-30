import React, { useEffect, useState } from 'react'
import { Container, Text, Color } from '@wings-software/uikit'
import cx from 'classnames'
import type { FontProps } from '@wings-software/uikit/dist/styled-props/font/FontProps'
import CVProgressBar from '@cv/components/CVProgressBar/CVProgressBar'
import type { DeploymentSummary } from 'services/cv'
import i18n from './ActivityProgressIndicator.i18n'
import css from './ActivityProgressIndicator.module.scss'

interface ActivityProgressIndicatorProps {
  data?: DeploymentSummary | null
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
    failed,
    remainingTimeMs,
    startTime,
    durationMs,
    riskScore
  } = props.data || {}
  const [progressValue, setProgressValue] = useState(0)
  const isValidProgressValue = props.data && progress !== undefined && progress !== null && progress > -1
  useEffect(() => {
    if (isValidProgressValue) {
      const timeoutRefNumber = setTimeout(() => {
        setProgressValue(progress! / 100)
        clearTimeout(timeoutRefNumber)
      }, 250)
    }
  }, [isValidProgressValue])

  if (!isValidProgressValue) {
    return (
      <Container className={cx(props.className, css.notStarted)}>
        <Text font={XSMALL_FONT_SIZE}>{i18n.verificationNotStarted}</Text>
        <CVProgressBar stripes={false} intent="none" />
      </Container>
    )
  }

  const passedVerifications = `${progressCount}/${total}`
  const minutesRemaining = Math.floor((remainingTimeMs ?? 0) / 1000 / 60)
  const duration = Math.floor((durationMs ?? 0) / 1000 / 60)

  let progressDescription = `${passedVerifications} ${i18n.verificationsInProgress} (${minutesRemaining} ${i18n.minutesRemaining})`
  if (progress === 100) {
    progressDescription = `${passedVerifications} ${i18n.verifications} ${i18n.passedVerification}`
  }

  return (
    <Container className={props.className}>
      {!!failed && (
        <Text color={progress === 100 ? undefined : Color.BLACK} font={XSMALL_FONT_SIZE}>
          {`${failed} ${i18n.failed}`}
        </Text>
      )}
      <Text color={progress === 100 ? undefined : Color.BLACK} font={XSMALL_FONT_SIZE}>
        {progressDescription}
      </Text>
      <CVProgressBar risk={riskScore} value={progressValue} stripes={false} />
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
