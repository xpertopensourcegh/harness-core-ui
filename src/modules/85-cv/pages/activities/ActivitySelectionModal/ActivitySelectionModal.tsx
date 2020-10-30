import React from 'react'
import { Dialog, IDialogProps, Classes } from '@blueprintjs/core'
import { Heading, Container, Color, IconName } from '@wings-software/uikit'
import cx from 'classnames'
import i18n from './ActivitiesSelectionModal.i18n'
import ActivityTypeCard from './ActivityTypeCard/ActivityTypeCard'
import css from './ActivitySelectionModal.module.scss'

export type ActivityType = 'verification-jobs' | 'activity-sources'
export function isActivityType(possibleActivityType: string): possibleActivityType is ActivityType {
  return possibleActivityType === 'activity-sources' || possibleActivityType === 'verification-jobs'
}
export const VerificationJobName = {
  BG: i18n.verificationJobName.bg,
  TEST: i18n.verificationJobName.test,
  CANARY: i18n.verificationJobName.canary,
  HEALTH: i18n.verificationJobName.health
}

export const ActivitySourceName = {
  KUBERNETES: i18n.activitySourceName.kube,
  AWS: i18n.activitySourceName.aws,
  GCP: i18n.activitySourceName.gcp,
  AZURE: i18n.activitySourceName.azure
}

const ActivityTypeSubOptions: {
  [key in ActivityType]: {
    modalTitle: string
    cards: Array<{ iconName: IconName; activityType?: string; activityName: string; className?: string }>
  }
} = {
  'verification-jobs': {
    modalTitle: i18n.modalTitles.verificationJob,
    cards: [
      {
        iconName: 'test-verification',
        activityType: i18n.deployment,
        activityName: VerificationJobName.TEST,
        className: css.testIcon
      },
      {
        iconName: 'bluegreen',
        activityType: i18n.deployment,
        activityName: VerificationJobName.BG
      },
      {
        iconName: 'canary-outline',
        activityType: i18n.deployment,
        activityName: VerificationJobName.CANARY
      },
      {
        iconName: 'health',
        activityType: i18n.postDeploy,
        activityName: VerificationJobName.HEALTH
      }
    ]
  },
  'activity-sources': {
    modalTitle: i18n.modalTitles.activitySource,
    cards: [
      {
        iconName: 'service-aws',
        activityName: i18n.activitySourceName.aws
      },
      {
        iconName: 'service-gcp',
        activityName: i18n.activitySourceName.gcp
      },
      {
        iconName: 'service-azure',
        activityName: i18n.activitySourceName.azure
      },
      {
        iconName: 'service-kubernetes',
        activityName: i18n.activitySourceName.kube
      }
    ]
  }
}

interface ActivitySelectionModalProps {
  onHide: () => void
  activityType: ActivityType
  onClickActivity: (activityName: string) => void
}

const modalProps: IDialogProps = {
  isOpen: true,
  usePortal: true,
  autoFocus: true,
  canEscapeKeyClose: true,
  canOutsideClickClose: true,
  enforceFocus: true
}

export function ActivitySelectionModal(props: ActivitySelectionModalProps): JSX.Element {
  const { activityType, onHide, onClickActivity } = props
  return (
    <Dialog {...modalProps} onClose={onHide} className={cx(Classes.DARK, css.main)}>
      <Container className={css.modalContent}>
        <Heading color={Color.WHITE}>{ActivityTypeSubOptions[activityType]?.modalTitle}</Heading>
        <Container className={css.activityNameContainer}>
          {ActivityTypeSubOptions[activityType]?.cards.map(
            ({ activityType: at, activityName: an, iconName: icon, className }) => {
              return (
                <ActivityTypeCard
                  key={an}
                  activityName={an}
                  activityType={at}
                  iconName={icon}
                  onClick={onClickActivity}
                  className={cx(css.activityCard, className)}
                />
              )
            }
          )}
        </Container>
      </Container>
    </Dialog>
  )
}
