import React, { useState, useEffect } from 'react'
import { Text, Layout, Container, Button, Color, Icon, Link, Card, CardBody, IconName } from '@wings-software/uicore'
import cx from 'classnames'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import { useGetCVSetupStatus, RestResponseCVSetupStatus, useGetDefaultHealthVerificationJob } from 'services/cv'
import { PageError } from '@common/components/Page/PageError'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import routes from '@common/RouteDefinitions'
import type { UseGetMockData } from '@common/utils/testUtils'
import { MonitoringSourceSetupRoutePaths } from '@cv/utils/routeUtils'
import { useIndexedDBHook, CVObjectStoreNames } from '@cv/hooks/IndexedDBHook/IndexedDBHook'
import { useToaster } from '@common/exports'

import { SETUP_INDEXDB_ID } from '@cv/constants'
import { useStrings } from 'framework/exports'
import { pluralize } from '@common/utils/StringUtils'
import { CVSelectionCard } from '@cv/components/CVSelectionCard/CVSelectionCard'
import ProgressStatus from './ProgressStatus/ProgressStatus'
import OnboardedSourceSummary from './OnboardedSourceSummary/OnboardedSourceSummary'
import { SetupIndexDBData, STEP, getCardLabelByType, getIconBySourceType } from './SetupUtils'
import i18n from './CVSetupPage.i18n'
import css from './CVSetupPage.module.scss'

export const StepIndex = new Map([
  [STEP.ACTIVITY_SOURCE, 1],
  [STEP.MONITORING_SOURCE, 2],
  [STEP.VERIFICATION_JOBS, 3]
])

const Status = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  NOT_VISITED: 'NOT_VISITED'
}

const ActivitySourcesHarness = [
  {
    type: 'HarnessCD_1.0',
    icon: 'cd-main',
    label: 'Harness CD 1.0',
    routeName: 'harness-cd',
    routeUrl: routes.toCVActivitySourceSetup
  }
]

const ActivitySources = [
  {
    type: 'K8sCluster',
    icon: 'service-kubernetes',
    label: 'Kubernetes',
    routeName: 'kubernetes',
    routeUrl: routes.toCVActivitySourceSetup
  }
]

const MonitoringSources = [
  {
    type: 'AppDynamics',
    icon: 'service-appdynamics',
    label: 'AppDynamics',
    routeName: MonitoringSourceSetupRoutePaths.APP_DYNAMICS,
    routeUrl: routes.toCVAdminSetupMonitoringSource
  },
  {
    type: 'GoogleCloudOperations',
    icon: 'service-stackdriver',
    label: 'Google Cloud Operations',
    routeName: MonitoringSourceSetupRoutePaths.GoogleCloudOperations,
    routeUrl: routes.toCVAdminSetupMonitoringSource
  }
]
interface CVSetupPageProps {
  setupStatusMockData?: UseGetMockData<RestResponseCVSetupStatus>
}
interface ActivitySourceContentProps {
  setActiveStep: (val: string) => void
  setActivitySource: (val: string) => void
  setMonitoringSource: (val: string) => void
  step: string | null
  indexDBData: SetupIndexDBData
}

const ActivitySourceContent: React.FC<ActivitySourceContentProps> = props => {
  const history = useHistory()
  const { getString } = useStrings()
  const [showSummary, setShowSummary] = useState(Boolean(props.step))
  const { projectIdentifier, orgIdentifier, accountId } = useParams()

  return (
    <Container>
      <Container height="calc(100vh - 100px)">
        <div className={css.monitoringContent}>
          {showSummary && props.indexDBData?.activitySources?.length ? (
            <OnboardedSourceSummary
              sources={props.indexDBData?.activitySources}
              title={`You have added ${props.indexDBData.activitySources.length} activity source${pluralize(
                props.indexDBData.activitySources.length
              )}`}
              setShowSummary={setShowSummary}
              buttonText={getString('cv.onboarding.activitySources.addMoreSources')}
            />
          ) : (
            <>
              <Text font={{ size: 'medium' }} margin={{ top: 'xlarge', bottom: 'small' }}>
                {i18n.activitySource.content.heading.start}
              </Text>
              <Text>{i18n.activitySource.content.info}</Text>
              <Layout.Horizontal margin={{ top: 'xxlarge' }}>
                <Layout.Vertical margin={{ right: 'xxlarge' }}>
                  <Text>{i18n.harness} </Text>
                  <div className={css.items}>
                    {ActivitySourcesHarness.map((item, index) => {
                      return (
                        <div
                          className={css.cardWrapper}
                          key={`${index}${item}`}
                          onClick={() =>
                            history.push(
                              item.routeUrl({
                                activitySource: item.routeName,
                                projectIdentifier,
                                orgIdentifier,
                                accountId
                              })
                            )
                          }
                        >
                          <Card interactive={true} className={css.cardCss}>
                            <CardBody.Icon icon={item.icon as IconName} iconSize={40} />
                          </Card>
                          <div className={css.cardLabel}>{item.label}</div>
                        </div>
                      )
                    })}
                  </div>
                </Layout.Vertical>
                <Layout.Vertical>
                  <Text>{i18n.infrastructureProvider} </Text>
                  <div className={css.items}>
                    {ActivitySources.map((item, index) => {
                      return (
                        <div
                          className={css.cardWrapper}
                          key={`${index}${item}`}
                          onClick={() =>
                            history.push(
                              item.routeUrl({
                                activitySource: item.routeName,
                                projectIdentifier,
                                orgIdentifier,
                                accountId
                              })
                            )
                          }
                        >
                          <Card interactive={true} className={css.cardCss}>
                            <CardBody.Icon icon={item.icon as IconName} iconSize={40} />
                          </Card>
                          <div className={css.cardLabel}>{item.label}</div>
                        </div>
                      )
                    })}
                  </div>
                </Layout.Vertical>
              </Layout.Horizontal>
            </>
          )}
        </div>
      </Container>
      <Layout.Horizontal style={{ float: 'right' }} padding="small">
        <Text margin={{ right: 'xsmall' }}>{i18n.activitySource.noActivitySource}</Text>

        <Link
          withoutHref
          onClick={() => {
            props.setActiveStep(STEP.MONITORING_SOURCE)
            props.setActivitySource(Status.COMPLETED)
            props.setMonitoringSource(Status.ACTIVE)
          }}
        >
          {i18n.activitySource.skip}
        </Link>
      </Layout.Horizontal>
    </Container>
  )
}
interface MonitoringSourceContentProps {
  statusData: RestResponseCVSetupStatus | null
  setActiveStep: (val: string) => void
  setActivitySource: (val: string) => void
  setMonitoringSource: (val: string) => void
  setVerificationJob: (val: string) => void
  monitoringSource: string
  step: string | null
  indexDBData: SetupIndexDBData
}
const MonitoringSourceContent: React.FC<MonitoringSourceContentProps> = props => {
  const history = useHistory()
  const { getString } = useStrings()
  const [showSummary, setShowSummary] = useState(Boolean(props.step))
  const { projectIdentifier, orgIdentifier, accountId } = useParams()

  return (
    <Layout.Horizontal>
      <Container height="100vh" width="70%">
        <div className={css.monitoringContent}>
          {showSummary && props.indexDBData?.monitoringSources?.length ? (
            <OnboardedSourceSummary
              sources={props.indexDBData?.monitoringSources}
              title={`You have added ${props.indexDBData.monitoringSources.length} monitoring source${pluralize(
                props.indexDBData.monitoringSources.length
              )}`}
              setShowSummary={setShowSummary}
              buttonText={getString('cv.onboarding.monitoringSources.addMoreSources')}
            />
          ) : (
            <>
              <Text font={{ size: 'medium' }} margin={{ top: 'xlarge', bottom: 'small' }}>
                {i18n.monitoringSource.content.heading}
              </Text>
              <Text>{i18n.monitoringSource.content.info}</Text>
              <div className={css.items}>
                {MonitoringSources.map((item, index) => {
                  return (
                    <div
                      className={css.cardWrapper}
                      key={`${index}${item}`}
                      onClick={() =>
                        history.push(
                          item.routeUrl({
                            monitoringSource: item.routeName,
                            projectIdentifier,
                            orgIdentifier,
                            accountId
                          })
                        )
                      }
                    >
                      <Card interactive={true} className={css.cardCss}>
                        <CardBody.Icon icon={item.icon as IconName} iconSize={40} />
                      </Card>
                      <div className={css.cardLabel}>{item.label}</div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </Container>
    </Layout.Horizontal>
  )
}

interface VerificatiionContentProps {
  indexDBData: SetupIndexDBData
  step: string | null
}

const VerificatiionContent: React.FC<VerificatiionContentProps> = props => {
  const history = useHistory()
  const { getString } = useStrings()
  const [showSummary] = useState(Boolean(props.step))
  const { projectIdentifier, orgIdentifier, accountId } = useParams()
  const { data, loading } = useGetDefaultHealthVerificationJob({
    queryParams: { accountId, projectIdentifier, orgIdentifier }
  })
  return (
    <Layout.Horizontal>
      <Container height="100vh" width="100%">
        OnboardedSourceSummary.tsx
        <div className={css.monitoringContent}>
          <Text
            font={{ size: 'medium', weight: 'bold' }}
            color={Color.BLACK}
            margin={{ top: 'xlarge', bottom: 'small' }}
          >
            {showSummary
              ? getString('cv.onboarding.verificationJobs.keepGoing')
              : getString('cv.onboarding.verificationJobs.heading')}
          </Text>
          <Text margin={{ bottom: 'large' }} color={Color.GREY_600}>
            {getString('cv.onboarding.verificationJobs.infoText')}
          </Text>
          {!loading ? (
            <>
              <Text color={Color.GREY_600}>{getString('cv.onboarding.verificationJobs.subHeading')}</Text>
              <div className={css.items}>
                <Layout.Vertical
                  spacing="small"
                  padding={{ right: 'small' }}
                  onClick={() => {
                    history.push(
                      routes.toCVAdminSetupVerificationJobEdit({
                        accountId,
                        projectIdentifier,
                        orgIdentifier,
                        verificationId: data?.resource?.identifier as string
                      })
                    )
                  }}
                >
                  <CVSelectionCard
                    isSelected={true}
                    className={css.monitoringCard}
                    iconProps={{
                      name: 'health',
                      size: 20
                    }}
                    cardLabel={getString('health')}
                  />
                  <Text
                    color={Color.BLUE_500}
                    font={{ size: 'small' }}
                    style={{ maxWidth: 80, textOverflow: 'ellipsis' }}
                    lineClamp={1}
                  >
                    {data?.resource?.jobName}
                  </Text>
                </Layout.Vertical>
                {props.indexDBData?.verificationJobs?.length
                  ? props.indexDBData.verificationJobs.map((item, index) => {
                      return (
                        <Layout.Vertical
                          spacing="small"
                          padding={{ right: 'small' }}
                          key={`${item}${index}`}
                          onClick={() => {
                            history.push(
                              routes.toCVAdminSetupVerificationJobEdit({
                                accountId,
                                projectIdentifier,
                                orgIdentifier,
                                verificationId: item.identifier
                              })
                            )
                          }}
                        >
                          <CVSelectionCard
                            isSelected={true}
                            className={css.monitoringCard}
                            iconProps={{
                              name: getIconBySourceType(item.type) as IconName,
                              size: 20
                            }}
                            cardLabel={getCardLabelByType(item.type)}
                          />
                          <Text
                            color={Color.BLUE_500}
                            font={{ size: 'small' }}
                            style={{ maxWidth: 80, textOverflow: 'ellipsis', textAlign: 'center' }}
                            lineClamp={1}
                          >
                            {item.name}
                          </Text>
                        </Layout.Vertical>
                      )
                    })
                  : null}
              </div>
            </>
          ) : (
            <Text>Checking for default jobs ...</Text>
          )}
          <Text margin={{ bottom: 'large' }} color={Color.GREY_600}>
            {getString('cv.onboarding.verificationJobs.createJobQues')}
          </Text>
          <Button
            text={getString('cv.onboarding.verificationJobs.createJob')}
            intent="primary"
            onClick={() =>
              history.push(
                routes.toCVAdminSetupVerificationJob({
                  accountId,
                  projectIdentifier,
                  orgIdentifier
                })
              )
            }
          />
        </div>
      </Container>
    </Layout.Horizontal>
  )
}

const CVSetupPage: React.FC<CVSetupPageProps> = props => {
  const [activitySource, setActivitySource] = useState<string>(Status.ACTIVE)
  const [monitoringSource, setMonitoringSource] = useState<string>(Status.NOT_VISITED)
  const [verificationJob, setVerificationJob] = useState<string>(Status.NOT_VISITED)
  const [activeStep, setActiveStep] = useState<string>(STEP.ACTIVITY_SOURCE)
  const { getString } = useStrings()
  const location = useLocation()
  const history = useHistory()
  const { showWarning } = useToaster()
  const [indexDBData, setIndexDBData] = useState<SetupIndexDBData>()
  const { isInitializingDB, dbInstance: setUpDbInstance } = useIndexedDBHook({})

  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  const queryParams = new URLSearchParams(location.search)
  const step = queryParams.get('step')

  const { data, loading, refetch, error } = useGetCVSetupStatus({
    queryParams: {
      accountId: accountId,
      projectIdentifier: projectIdentifier,
      orgIdentifier: orgIdentifier
    },
    mock: props.setupStatusMockData
  })
  // Might not need this api now
  // const categories = data?.resource?.stepsWhichAreCompleted

  const clearDB = async () => {
    try {
      await setUpDbInstance?.clear(CVObjectStoreNames.SETUP)
      setUpDbInstance?.close()
    } catch (e) {
      showWarning(e)
    }
  }

  const historyUnlisten = history.listen(loc => {
    if (!loc.pathname.includes('/admin/setup')) {
      clearDB()
      historyUnlisten()
    }
  })

  useEffect(() => {
    if (step) {
      if (!isInitializingDB && setUpDbInstance) {
        setUpDbInstance.get(CVObjectStoreNames.SETUP, SETUP_INDEXDB_ID)?.then(resultData => {
          if (resultData) {
            setIndexDBData(resultData)

            if (step === '1') {
              if (activeStep === STEP.MONITORING_SOURCE) {
                setActivitySource(Status.COMPLETED)
              }
            }

            if (step === '2') {
              if (activeStep === STEP.ACTIVITY_SOURCE) {
                setActiveStep(STEP.MONITORING_SOURCE)
                setMonitoringSource(Status.ACTIVE)
                setActivitySource(Status.COMPLETED)
              }
            }
            if (step === '3') {
              if (activeStep === STEP.ACTIVITY_SOURCE) {
                setActiveStep(STEP.VERIFICATION_JOBS)
                setVerificationJob(Status.COMPLETED)
                setActivitySource(Status.COMPLETED)
                setMonitoringSource(Status.COMPLETED)
              }
            }
          }
        })
      }
    }
  }, [isInitializingDB, setUpDbInstance])
  return (
    <Container>
      {loading || isInitializingDB ? (
        <PageSpinner />
      ) : error ? (
        <div style={{ height: '100vh' }}>
          <PageError message={error.message} onClick={() => refetch()} />
        </div>
      ) : (
        <Layout.Horizontal height="100vh">
          <Layout.Vertical padding="large" width="30%">
            <Text>Setup</Text>
            <Container height="calc(100vh - 128px)" margin={'small'}>
              <Layout.Vertical style={{ position: 'relative', top: 150 }}>
                <Layout.Horizontal>
                  <Layout.Vertical spacing="xsmall">
                    {activitySource === Status.COMPLETED ? (
                      <Icon name="tick-circle" color="green500" size={20} />
                    ) : activeStep === STEP.ACTIVITY_SOURCE && activitySource === Status.ACTIVE ? (
                      <span className={css.number}>1</span>
                    ) : (
                      <Text>1</Text>
                    )}
                    <div
                      className={cx(css.dashedLine, {
                        [css.dashedLineVisited]: activitySource !== Status.NOT_VISITED,
                        [css.dashedLineNotVisited]: activitySource === Status.NOT_VISITED
                      })}
                    ></div>
                  </Layout.Vertical>
                  <Layout.Vertical width="90%" className={css.stepLabel} spacing="small">
                    <Text
                      font={{ size: 'medium', weight: 'bold' }}
                      color={activeStep === STEP.ACTIVITY_SOURCE ? Color.BLACK : Color.GREY_500}
                    >
                      {i18n.activitySource.heading}
                    </Text>
                    <Text font={{ weight: 'light' }} color={Color.GREY_400}>
                      {i18n.activitySource.info}
                    </Text>
                  </Layout.Vertical>
                </Layout.Horizontal>
                <Layout.Horizontal>
                  <Layout.Vertical spacing="xsmall">
                    {monitoringSource === Status.COMPLETED ? (
                      <Icon name="tick-circle" color="green500" size={20} />
                    ) : activeStep === STEP.MONITORING_SOURCE && monitoringSource === Status.ACTIVE ? (
                      <span className={css.number}>2</span>
                    ) : (
                      <span className={css.onlyNumber}> 2</span>
                    )}
                    <div
                      className={cx(css.dashedLine, {
                        [css.dashedLineVisited]: monitoringSource !== Status.NOT_VISITED,
                        [css.dashedLineNotVisited]: monitoringSource === Status.NOT_VISITED
                      })}
                    ></div>
                  </Layout.Vertical>
                  <Layout.Vertical width="90%" className={css.stepLabel} spacing="small">
                    <Text
                      font={{ size: 'medium', weight: 'bold' }}
                      color={activeStep === STEP.MONITORING_SOURCE ? Color.BLACK : Color.GREY_500}
                    >
                      {i18n.monitoringSource.heading}
                    </Text>
                    <Text font={{ weight: 'light' }} color={Color.GREY_400}>
                      {i18n.monitoringSource.info}
                    </Text>
                  </Layout.Vertical>
                </Layout.Horizontal>
                <Layout.Horizontal>
                  <Layout.Vertical>
                    {verificationJob === Status.COMPLETED ? (
                      <Icon name="tick-circle" color="green500" size={20} />
                    ) : activeStep === STEP.VERIFICATION_JOBS && verificationJob === Status.ACTIVE ? (
                      <span className={css.number}>{3}</span>
                    ) : (
                      <span className={css.onlyNumber}> 3</span>
                    )}
                  </Layout.Vertical>
                  <Layout.Vertical width="90%" className={css.stepLabel} spacing="small">
                    <Text
                      font={{ size: 'medium', weight: 'bold' }}
                      color={activeStep === STEP.VERIFICATION_JOBS ? Color.BLACK : Color.GREY_500}
                    >
                      {i18n.verificationJob.heading}
                    </Text>
                    <Text font={{ weight: 'light' }} color={Color.GREY_400} padding={{ top: 10 }}>
                      {i18n.verificationJob.info}
                    </Text>
                  </Layout.Vertical>
                </Layout.Horizontal>
              </Layout.Vertical>
            </Container>
            <Layout.Horizontal spacing="medium">
              <Button
                text="Previous"
                icon="chevron-left"
                onClick={() => {
                  if (activeStep === STEP.ACTIVITY_SOURCE) {
                    history.push(routes.toCVProjectOverview({ accountId, projectIdentifier, orgIdentifier }))
                  } else if (activeStep === STEP.MONITORING_SOURCE) {
                    setActiveStep(STEP.ACTIVITY_SOURCE)
                    setActivitySource(Status.ACTIVE)
                  } else if (activeStep === STEP.VERIFICATION_JOBS) {
                    setActiveStep(STEP.MONITORING_SOURCE)
                    setMonitoringSource(Status.ACTIVE)
                  }
                }}
              />
              <Button
                intent="primary"
                text={step === '3' ? getString('finish') : getString('next')}
                rightIcon="chevron-right"
                onClick={() => {
                  if (activeStep === STEP.ACTIVITY_SOURCE) {
                    setActiveStep(STEP.MONITORING_SOURCE)
                    setMonitoringSource(Status.ACTIVE)
                    setActivitySource(Status.COMPLETED)
                  } else if (activeStep === STEP.MONITORING_SOURCE) {
                    setActiveStep(STEP.VERIFICATION_JOBS)
                    setVerificationJob(Status.ACTIVE)
                    setMonitoringSource(Status.COMPLETED)
                  } else if (activeStep === STEP.VERIFICATION_JOBS) {
                    history.push(routes.toCVProjectOverview({ accountId, projectIdentifier, orgIdentifier }))
                  }
                }}
              />
            </Layout.Horizontal>
          </Layout.Vertical>
          <Container
            background={Color.GREY_200}
            width={data?.resource?.totalNumberOfEnvironments && data?.resource?.totalNumberOfServices ? '50%' : '70%'}
          >
            {activeStep === STEP.ACTIVITY_SOURCE ? (
              <ActivitySourceContent
                setActiveStep={setActiveStep}
                setActivitySource={setActivitySource}
                setMonitoringSource={setMonitoringSource}
                step={step}
                indexDBData={indexDBData as SetupIndexDBData}
                // setActivitySourceType={setActivitySourceType}
              />
            ) : activeStep === STEP.MONITORING_SOURCE ? (
              <MonitoringSourceContent
                step={step}
                indexDBData={indexDBData as SetupIndexDBData}
                statusData={data}
                monitoringSource={monitoringSource}
                setActiveStep={setActiveStep}
                setActivitySource={setActivitySource}
                setMonitoringSource={setMonitoringSource}
                setVerificationJob={setVerificationJob}
              />
            ) : activeStep === STEP.VERIFICATION_JOBS ? (
              <VerificatiionContent step={step} indexDBData={indexDBData as SetupIndexDBData} />
            ) : null}
          </Container>
          {data?.resource?.totalNumberOfEnvironments && data?.resource?.totalNumberOfServices ? (
            <ProgressStatus
              numberOfServicesUsedInActivitySources={data?.resource?.numberOfServicesUsedInActivitySources}
              numberOfServicesUsedInMonitoringSources={data?.resource?.numberOfServicesUsedInMonitoringSources}
              totalNumberOfEnvironments={data?.resource?.totalNumberOfEnvironments}
              totalNumberOfServices={data?.resource?.totalNumberOfServices}
              servicesUndergoingHealthVerification={data?.resource?.servicesUndergoingHealthVerification}
            />
          ) : null}
        </Layout.Horizontal>
      )}
    </Container>
  )
}

export default CVSetupPage
