import React, { useState, useCallback } from 'react'
import { Page } from 'modules/common/exports'
import { Container, Heading, Text, Color, Button, useModalHook } from '@wings-software/uikit'
import i18n from './ActivitiesPage.i18n'
import css from './ActivitiesPage.module.scss'
import cx from 'classnames'
import { routeParams, linkTo } from 'framework/exports'
import {
  ActivitySelectionModal,
  ActivityType,
  isActivityType,
  VerificationJobName,
  ActivitySourceName
} from './ActivitySelectionModal/ActivitySelectionModal'
import { useHistory } from 'react-router-dom'
import { routeCVActivityDetails } from 'modules/cv/routes'
import { ActivityDetailsActivityType, ActivityDetailsActivitySource } from 'modules/cv/routePaths'

const VerificationJobTileSelectionToRoute = {
  [VerificationJobName.TEST]: ActivityDetailsActivityType.TEST,
  [VerificationJobName.BG]: ActivityDetailsActivityType.BG,
  [VerificationJobName.CANARY]: ActivityDetailsActivityType.CANARY,
  [VerificationJobName.HEALTH]: ActivityDetailsActivityType.HEALTH
}

const VerificationActivitySourceTileSelectionToRoute = {
  [ActivitySourceName.KUBERNETES]: ActivityDetailsActivitySource.KUBERNETES,
  [ActivitySourceName.AWS]: ActivityDetailsActivitySource.AWS,
  [ActivitySourceName.GCP]: ActivityDetailsActivitySource.GCP,
  [ActivitySourceName.AZURE]: ActivityDetailsActivitySource.AZURE
}

function ActivitiesPageTitle(): JSX.Element {
  const {
    params: { activitySubType = i18n.activitySubTypes.activities }
  } = routeParams()

  return (
    <Container className={css.pageTitleContainer}>
      <Heading level={2} color={Color.BLACK}>
        {i18n.pageTitle}
      </Heading>
      <Container className={css.subTypes}>
        {Object.values(i18n.activitySubTypes).map(subType => {
          return (
            <Text
              key={subType}
              inline
              font="small"
              className={cx(css.subType, activitySubType === subType ? css.selectedSubType : undefined)}
            >
              {subType}
            </Text>
          )
        })}
      </Container>
    </Container>
  )
}

function NoActivities(): JSX.Element {
  const [selectedActivityType, setActivityType] = useState<ActivityType | undefined>()
  const history = useHistory()
  const onActivityTypeOptionClickCallback = useCallback(
    (activityName: string) => {
      let routePath
      if (selectedActivityType === 'activity-sources') {
        routePath = VerificationActivitySourceTileSelectionToRoute[activityName]
      } else if (selectedActivityType === 'verification-jobs') {
        routePath = VerificationJobTileSelectionToRoute[activityName]
      }

      if (routePath) {
        history.push(linkTo(routeCVActivityDetails, { activityType: routePath }), true)
      }
    },
    [history, selectedActivityType]
  )
  const [openModal, hideModal] = useModalHook(() => {
    return selectedActivityType ? (
      <ActivitySelectionModal
        activityType={selectedActivityType}
        onHide={hideModal}
        onClickActivity={onActivityTypeOptionClickCallback}
      />
    ) : (
      <span />
    )
  }, [selectedActivityType, onActivityTypeOptionClickCallback])
  const onActivityTypeClickCallback = useCallback(
    (selectedActivity: string) => () => {
      if (isActivityType(selectedActivity)) {
        setActivityType(selectedActivity)
        openModal()
      }
    },
    [openModal]
  )

  return (
    <Container className={css.noActivities}>
      <Container background={Color.GREY_200} margin={{ bottom: 'xlarge' }} className={css.activityPlaceholder} />
      <Container className={css.noActivityButtonsContainer}>
        {Object.values(i18n.noActivityButtons).map(buttonText => (
          <Button key={buttonText.label} onClick={onActivityTypeClickCallback(buttonText.value)}>
            {buttonText.label}
          </Button>
        ))}
      </Container>
    </Container>
  )
}

export default function ActivitiesPage(): JSX.Element {
  const [hasActivities] = useState(false)
  return (
    <Page.Body>
      <Container className={css.main}>
        <Page.Header title={hasActivities ? <ActivitiesPageTitle /> : i18n.pageTitle} />
        <NoActivities />
      </Container>
    </Page.Body>
  )
}
