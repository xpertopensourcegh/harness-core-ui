import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container, IconName } from '@wings-software/uikit'
import { pick } from 'lodash-es'
import routes from '@common/RouteDefinitions'

import type { AccountPathProps, ProjectPathProps, VerificationPathProps } from '@common/interfaces/RouteInterfaces'

import { useStrings } from 'framework/exports'
import { Page } from '@common/exports'
import { VerificationJobType } from '@cv/constants'
import { useGetVerificationJob } from 'services/cv'
import useCVTabsHook from '@cv/hooks/CVTabsHook/useCVTabsHook'
import CVOnboardingTabs from '@cv/components/CVOnboardingTabs/CVOnboardingTabs'
import { OnBoardingPageHeader } from '../onboarding/OnBoardingPageHeader/OnBoardingPageHeader'

import VerificationJobsDetails from './VerificationJobsDetails/VerificationJobsDetails'

import TestVerificationJob from './TestVerificationJob/TestVerificationJob'
import CanaryBlueGreenVerificationJob from './CanaryBlueGreenVerificationJob/CanaryBlueGreenVerificationJob'
import HealthVerificationJob from './HealthVerificationJob/HealthVerificationJob'
import css from './VerificationJobsSetup.module.scss'

interface VerificationJobsData {
  name: string
  identifier: string
  type: string
}
interface ConfigureVerificationJobProps {
  currentData: any
  onPrevious: () => void
  onNext: (data: any) => void
}

export const getIconByVerificationType = (type: string | undefined) => {
  switch (type) {
    case VerificationJobType.TEST:
      return 'lab-test'
    case VerificationJobType.CANARY:
      return 'canary-outline'
    case VerificationJobType.BLUE_GREEN:
      return 'bluegreen'
    case VerificationJobType.HEALTH:
      return 'health'

    default:
      return '' as IconName
  }
}

const ConfigureVerificationJob: React.FC<ConfigureVerificationJobProps> = props => {
  switch (props.currentData.type) {
    case VerificationJobType.TEST:
      return <TestVerificationJob stepData={props.currentData} onNext={props.onNext} onPrevious={props.onPrevious} />
    case VerificationJobType.CANARY:
    case VerificationJobType.BLUE_GREEN:
      return (
        <CanaryBlueGreenVerificationJob
          stepData={props.currentData}
          onNext={props.onNext}
          onPrevious={props.onPrevious}
        />
      )
    case VerificationJobType.HEALTH:
      return <HealthVerificationJob stepData={props.currentData} onNext={props.onNext} onPrevious={props.onPrevious} />

    default:
      return <div></div>
  }
}

const VerificationJobsSetup = (): JSX.Element => {
  const { projectIdentifier, orgIdentifier, accountId, verificationId } = useParams<
    AccountPathProps & ProjectPathProps & VerificationPathProps
  >()
  const { getString } = useStrings()

  const { onNext, currentData, setCurrentData, ...tabInfo } = useCVTabsHook<VerificationJobsData>({ totalTabs: 2 })

  const { data: verificationJob, loading, error, refetch: getVerificationJob } = useGetVerificationJob({ lazy: true })

  useEffect(() => {
    if (verificationId) {
      getVerificationJob({
        queryParams: {
          accountId,
          identifier: verificationId
        }
      })
    }
  }, [verificationId])

  useEffect(() => {
    if (verificationJob?.resource) {
      setCurrentData({
        ...pick(verificationJob.resource, ['identifier', 'type', 'duration', 'sensitivity', 'dataSources']),
        name: verificationJob.resource.jobName,
        service: verificationJob.resource.serviceIdentifier,
        environment: verificationJob.resource.envIdentifier,
        activitySource: verificationJob.resource.activitySourceIdentifier
      } as VerificationJobsData)
    }
  }, [verificationJob?.resource])

  return (
    <Container className={css.pageDimensions}>
      <OnBoardingPageHeader
        breadCrumbs={[
          {
            label: getString('verificationJobs'),
            url: routes.toCVAdminSetupVerificationJob({
              projectIdentifier,
              orgIdentifier,

              accountId
            })
          }
        ]}
      />
      {
        <Page.Body loading={Boolean(verificationId) && loading} error={verificationId ? error?.message : undefined}>
          <CVOnboardingTabs
            iconName={getIconByVerificationType(currentData?.type)}
            defaultEntityName={currentData?.name || 'Default Name'}
            setName={val => setCurrentData({ ...currentData, name: val } as VerificationJobsData)}
            onNext={onNext}
            {...tabInfo}
            tabProps={[
              {
                id: 1,
                title: getString('cv.verificationJobs.details.tabName'),
                component: (
                  <VerificationJobsDetails
                    stepData={currentData}
                    onNext={data => {
                      setCurrentData({ ...currentData, ...data })
                      onNext({ data: { ...currentData, ...data } })
                    }}
                  />
                )
              },
              {
                id: 2,
                title: getString('cv.verificationJobs.configure.tabName'),
                component: (
                  <ConfigureVerificationJob
                    onPrevious={tabInfo.onPrevious}
                    currentData={currentData}
                    onNext={data => {
                      setCurrentData({ ...currentData, ...data })
                      onNext({ data: { ...currentData, ...data } })
                    }}
                  />
                )
              }
            ]}
          />
        </Page.Body>
      }
    </Container>
  )
}

export default VerificationJobsSetup
