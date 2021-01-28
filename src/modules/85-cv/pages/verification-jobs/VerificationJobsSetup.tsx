import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container, IconName, RUNTIME_INPUT_VALUE, SelectOption } from '@wings-software/uicore'
import { pick } from 'lodash-es'
import routes from '@common/RouteDefinitions'

import type { AccountPathProps, ProjectPathProps, VerificationPathProps } from '@common/interfaces/RouteInterfaces'

import { useStrings } from 'framework/exports'
import { Page } from '@common/exports'
import { VerificationJobType } from '@cv/constants'
import { GetVerificationJobQueryParams, useGetVerificationJob } from 'services/cv'
import useCVTabsHook from '@cv/hooks/CVTabsHook/useCVTabsHook'
import CVOnboardingTabs from '@cv/components/CVOnboardingTabs/CVOnboardingTabs'
import { VerificationSensitivityOptions } from '@cv/pages/verification-jobs/VerificationJobForms/VerificationJobFields.tsx'
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

export type VerificationSensitivity = 'HIGH' | 'LOW' | 'MEDIUM'

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

export function getRuntimeValueOrSelectOption(val?: string): SelectOption | string | undefined {
  if (!val) {
    return
  }
  return val === RUNTIME_INPUT_VALUE ? val : { label: val, value: val }
}

export function getRuntimeValueOrSelectOptionForSensitivity(
  val?: VerificationSensitivity | string
): SelectOption | string | undefined {
  if (!val) {
    return
  }

  return val === RUNTIME_INPUT_VALUE
    ? val
    : { label: sensitivityEnunToLabel(val as VerificationSensitivity), value: val }
}

export function sensitivityEnunToLabel(sensitivity: VerificationSensitivity): string {
  switch (sensitivity) {
    case 'HIGH':
      return VerificationSensitivityOptions[0].label
    case 'MEDIUM':
      return VerificationSensitivityOptions[1].label
    case 'LOW':
    default:
      return VerificationSensitivityOptions[2].label
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
          identifier: verificationId,
          orgIdentifier,
          projectIdentifier
        } as GetVerificationJobQueryParams
      })
    }
  }, [verificationId])

  useEffect(() => {
    if (verificationJob?.resource) {
      setCurrentData({
        ...pick(verificationJob.resource, ['identifier', 'type']),
        dataSource: verificationJob.resource.monitoringSources?.map(source => ({
          label: source,
          value: source
        })),
        sensitivity: getRuntimeValueOrSelectOptionForSensitivity((verificationJob.resource as any).sensitivity),
        trafficSplit: getRuntimeValueOrSelectOption((verificationJob.resource as any).trafficSplitPercentage),
        duration: getRuntimeValueOrSelectOption(verificationJob.resource.duration),
        name: verificationJob.resource.jobName,
        service: getRuntimeValueOrSelectOption(verificationJob.resource.serviceIdentifier),
        environment: getRuntimeValueOrSelectOption(verificationJob.resource.envIdentifier),
        activitySource: verificationJob.resource.activitySourceIdentifier,
        baseline: getRuntimeValueOrSelectOption(verificationJob.resource.envIdentifier)
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
        <Page.Body
          loading={Boolean(verificationId) && loading}
          key={Boolean(verificationId).toString() && loading?.toString()}
          error={verificationId ? error?.message : undefined}
        >
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
                      setCurrentData({ ...data })
                      onNext({ data: { ...data } })
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
                      setCurrentData({ ...data })
                      onNext({ data: { ...data } })
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
