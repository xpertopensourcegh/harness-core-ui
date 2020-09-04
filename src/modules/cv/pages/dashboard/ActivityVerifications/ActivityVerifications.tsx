import React from 'react'
import { Container, Text, Color, Button } from '@wings-software/uikit'
import type { Intent } from '@blueprintjs/core'
import ActivityProgressIndicator from '../ActivityProgressIndicator/ActivityProgressIndicator'
import i18n from './ActivityVerifications.i18n'
import ActivityType from '../ActivityType/ActivityType'
import css from './ActivityVerifications.module.scss'

const RECENT_VERIFICATIONS_COLUMN_NAMES = Object.values(i18n.activityVerificationsColumns).map(columnName => (
  <Text
    width={columnName === i18n.activityVerificationsColumns.deployments ? 200 : 300}
    key={columnName}
    font={{ weight: 'bold', size: 'small' }}
    style={{ textTransform: 'uppercase' }}
  >
    {columnName}
  </Text>
))

const MOCK_DATA = [
  {
    buildName: 'Build 77',
    serviceName: 'Manager',
    preProdVerification: {
      progress: 15,
      startTime: new Date().getTime() - 60000,
      passedVerifications: '2/3',
      minutesRemaining: 20,
      status: 'success' as Intent
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
      status: 'danger' as Intent,
      duration: 10
    },
    prodVerification: {
      progress: 100,
      startTime: new Date().getTime() - 30000,
      passedVerifications: '1/1',
      minutesRemaining: 0,
      status: 'success' as Intent,
      duration: 10
    },
    postVerification: {
      progress: 43,
      startTime: new Date().getTime(),
      minutesRemaining: 3,
      passedVerifications: '1/4',
      status: 'success' as Intent
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
      status: 'success' as Intent,
      duration: 5
    },
    prodVerification: {
      progress: 65,
      startTime: new Date().getTime() - 30000,
      minutesRemaining: 12,
      passedVerifications: '1/1',
      status: 'danger' as Intent
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
      status: 'success' as Intent
    },
    prodVerification: {
      progress: 100,
      startTime: new Date().getTime() - 30000,
      passedVerifications: '1/1',
      minutesRemaining: 0,
      duration: 10,
      status: 'success' as Intent
    },
    postVerification: {
      progress: 35,
      startTime: new Date().getTime(),
      minutesRemaining: 4,
      passedVerifications: '1/2',
      status: 'warning' as Intent
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
      status: 'success' as Intent
    },
    prodVerification: {
      progress: 100,
      startTime: new Date().getTime() - 30000,
      passedVerifications: '2/2',
      minutesRemaining: 0,
      duration: 20,
      status: 'success' as Intent
    },
    postVerification: {
      progress: 100,
      startTime: new Date().getTime(),
      passedVerifications: '2/2',
      minutesRemaining: 0,
      duration: 18,
      status: 'success' as Intent
    }
  }
]

export default function ActivityVerifications(): JSX.Element {
  return (
    <Container className={css.main}>
      <Container className={css.header}>
        <Text className={css.headerText}>{i18n.activityVerificationHeaderText.title}</Text>
        <Text rightIcon="horizontal-bar-chart-asc" rightIconProps={{ intent: 'primary' }} color={Color.BLACK}>
          {i18n.viewAllActivities}
        </Text>
      </Container>
      <ul className={css.activityList}>
        <li className={css.headerRow}>{RECENT_VERIFICATIONS_COLUMN_NAMES}</li>
        {MOCK_DATA.map(data => {
          const { serviceName, buildName, ...verificationResultProps } = data || {}
          return (
            <li key={`${buildName}-${serviceName}`} className={css.dataRow}>
              <ActivityType buildName={buildName} serviceName={serviceName} iconProps={{ name: 'nav-cd' }} />
              <ActivityProgressIndicator {...verificationResultProps.preProdVerification} className={css.dataColumn} />
              <ActivityProgressIndicator {...verificationResultProps.prodVerification} className={css.dataColumn} />
              <ActivityProgressIndicator {...verificationResultProps.postVerification} className={css.dataColumn} />
            </li>
          )
        })}
        <Button
          style={{
            margin: '0 auto',
            display: 'block',
            fontSize: 'var(--font-size-small)'
          }}
          minimal
          intent="primary"
        >
          {i18n.viewAllActivities}
        </Button>
      </ul>
    </Container>
  )
}
