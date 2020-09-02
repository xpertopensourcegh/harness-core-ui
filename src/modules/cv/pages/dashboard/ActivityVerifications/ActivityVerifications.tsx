import React, { useState, useEffect } from 'react'
import { Container, Text, Color, Icon } from '@wings-software/uikit'
import { ProgressBar, IProgressBarProps, Intent } from '@blueprintjs/core'
import type { FontProps } from '@wings-software/uikit/dist/styled-props/font/FontProps'
import cx from 'classnames'
import i18n from './ActivityVerifications.i18n'
import css from './ActivityVerifications.module.scss'

interface BuildContentProps {
  serviceName: string
  buildName: string
}

interface VerificationResultProps {
  progress: number
  startTime?: number
  passedVerifications?: string
  minutesRemaining?: number
  duration?: number
  status?: string
}

const RECENT_VERIFICATIONS_COLUMN_NAMES = Object.values(i18n.activityVerificationsColumns).map(columnName => (
  <Text
    width={columnName === i18n.activityVerificationsColumns.deployments ? 150 : 300}
    key={columnName}
    font={{ weight: 'bold', size: 'small' }}
    style={{ textTransform: 'uppercase' }}
  >
    {columnName}
  </Text>
))

const SMALL_FONT_SIZE: FontProps = {
  size: 'small'
}

const XSMALL_FONT_SIZE: FontProps = {
  size: 'xsmall'
}

const PROGRESS_BAR_DEFAULT_PROPS: IProgressBarProps = {
  stripes: false,
  intent: 'none'
}

const BUILD_CONTENT_TEXT_STYLES = {
  alignSelf: 'center'
}

const MOCK_DATA = [
  {
    buildName: 'Build 77',
    serviceName: 'Manager',
    preProdVerification: {
      progress: 15,
      startTime: new Date().getTime() - 60000,
      passedVerifications: '2/3',
      minutesRemaining: 20,
      riskStatus: 'LOW'
    },
    prodVerification: {
      progress: -1
    },
    postVerification: {
      progress: -1
    }
  },
  {
    buildName: 'Hotfix-1',
    serviceName: 'WingsUI',
    preProdVerification: {
      progress: 100,
      startTime: new Date().getTime() - 60000,
      passedVerifications: '2/3',
      minutesRemaining: 0,
      status: 'HIGH',
      duration: 10
    },
    prodVerification: {
      progress: 100,
      startTime: new Date().getTime() - 30000,
      passedVerifications: '1/1',
      minutesRemaining: 0,
      status: 'LOW',
      duration: 10
    },
    postVerification: {
      progress: 43,
      startTime: new Date().getTime(),
      minutesRemaining: 3,
      passedVerifications: '1/4',
      status: 'LOW'
    }
  },
  {
    buildName: 'Build 76',
    serviceName: 'Manager',
    preProdVerification: {
      progress: 100,
      startTime: new Date().getTime() - 60000,
      passedVerifications: '1/1',
      minutesRemaining: 0,
      duration: 5
    },
    prodVerification: {
      progress: 65,
      startTime: new Date().getTime() - 30000,
      minutesRemaining: 12,
      passedVerifications: '1/1',
      status: 'HIGH'
    },
    postVerification: {
      progress: -1
    }
  },
  {
    buildName: 'Build 23',
    serviceName: 'Delegate',
    preProdVerification: {
      progress: 100,
      startTime: new Date().getTime() - 60000,
      passedVerifications: '2/2',
      minutesRemaining: 0,
      duration: 12,
      status: 'LOW'
    },
    prodVerification: {
      progress: 100,
      startTime: new Date().getTime() - 30000,
      passedVerifications: '1/1',
      minutesRemaining: 0,
      duration: 10,
      status: 'LOW'
    },
    postVerification: {
      progress: 35,
      startTime: new Date().getTime(),
      minutesRemaining: 4,
      passedVerifications: '1/2',
      status: 'MEDIUM'
    }
  },
  {
    buildName: 'Build 2',
    serviceName: 'CV-NextGen',
    preProdVerification: {
      progress: 100,
      startTime: new Date().getTime() - 60000,
      passedVerifications: '2/2',
      minutesRemaining: 0,
      duration: 12,
      status: 'LOW'
    },
    prodVerification: {
      progress: 100,
      startTime: new Date().getTime() - 30000,
      passedVerifications: '2/2',
      minutesRemaining: 0,
      duration: 20,
      status: 'LOW'
    },
    postVerification: {
      progress: 100,
      startTime: new Date().getTime(),
      passedVerifications: '2/2',
      minutesRemaining: 0,
      duration: 18,
      status: 'LOW'
    }
  }
]

function BuildContent(props: BuildContentProps): JSX.Element {
  const { buildName, serviceName } = props
  return (
    <Container className={css.buildContent}>
      <Icon name="nav-cd" intent="none" size={30} style={BUILD_CONTENT_TEXT_STYLES} />
      <Container style={BUILD_CONTENT_TEXT_STYLES}>
        <Text font={SMALL_FONT_SIZE}>{buildName}</Text>
        <Text font={SMALL_FONT_SIZE} color={Color.GREY_350}>
          {serviceName}
        </Text>
      </Container>
    </Container>
  )
}

function VerificationResult(props: VerificationResultProps): JSX.Element {
  const { progress, startTime, passedVerifications, minutesRemaining, duration, status } = props
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
      <Container className={cx(css.dataColumn, css.notStarted)}>
        <Text font={XSMALL_FONT_SIZE}>{i18n.verificationResultText.verificationNotStarted}</Text>
        <ProgressBar {...PROGRESS_BAR_DEFAULT_PROPS} className={css.progressBar} animate={true} />
      </Container>
    )
  }

  let intent: Intent = 'success'
  if (status === 'HIGH') {
    intent = 'danger'
  } else if (status === 'MEDIUM') {
    intent = 'warning'
  }

  let progressDescription = `${passedVerifications} ${i18n.verificationResultText.verificationsInProgress} (${minutesRemaining} ${i18n.verificationResultText.minutesRemaining})`
  if (progress === 100) {
    progressDescription = `${passedVerifications} ${i18n.verificationResultText.verifications} ${i18n.verificationResultText.passedVerification}`
  }

  return (
    <Container className={css.dataColumn}>
      <Text color={progress === 100 ? undefined : Color.BLACK} font={XSMALL_FONT_SIZE}>
        {progressDescription}
      </Text>
      <ProgressBar intent={intent} value={progressValue} stripes={false} animate={true} className={css.progressBar} />
      <Container flex>
        {startTime !== undefined && startTime !== null && (
          <Text color={Color.GREY_300} font={XSMALL_FONT_SIZE}>
            {`${i18n.verificationResultText.startOn} ${new Date(startTime).toLocaleString()}`}
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

export default function ActivityVerifications(): JSX.Element {
  return (
    <Container className={css.main}>
      <Container className={css.header}>
        <Text className={css.headerText}>{i18n.activityVerificationHeaderText.title}</Text>
        <Text rightIcon="horizontal-bar-chart-asc" rightIconProps={{ intent: 'primary' }} color={Color.BLACK}>
          {i18n.activityVerificationHeaderText.viewAllActivities}
        </Text>
      </Container>
      <ul className={css.verificationList}>
        <li className={css.headerRow}>{RECENT_VERIFICATIONS_COLUMN_NAMES}</li>
        {MOCK_DATA.map(data => {
          const { serviceName, buildName, ...verificationResultProps } = data || {}
          return (
            <li key={`${buildName}-${serviceName}`} className={css.dataRow}>
              <BuildContent buildName={buildName} serviceName={serviceName} />
              <VerificationResult {...verificationResultProps.preProdVerification} />
              <VerificationResult {...verificationResultProps.prodVerification} />
              <VerificationResult {...verificationResultProps.postVerification} />
            </li>
          )
        })}
      </ul>
    </Container>
  )
}
