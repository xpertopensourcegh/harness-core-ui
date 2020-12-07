import React, { useState, useEffect } from 'react'
import { Text, Layout, Container, Button, Color, Icon, Link, Card, CardBody, IconName } from '@wings-software/uikit'
import cx from 'classnames'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import { useGetCVSetupStatus, RestResponseCVSetupStatus } from 'services/cv'
import { PageError } from '@common/components/Page/PageError'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import routes from '@common/RouteDefinitions'
import type { UseGetMockData } from '@common/utils/testUtils'
import { MonitoringSourceSetupRoutePaths } from '@cv/utils/routeUtils'
import ProgressStatus from './ProgressStatus/ProgressStatus'

import i18n from './CVSetupPage.i18n'
import css from './CVSetupPage.module.scss'

export const STEP = {
  ACTIVITY_SOURCE: 'ACTIVITY_SOURCE',
  MONITORING_SOURCE: 'MONITORING_SOURCE',
  VERIFICATION_JOBS: 'VERIFICATION_JOBS'
}

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
}

const ActivitySourceContent: React.FC<ActivitySourceContentProps> = props => {
  const history = useHistory()
  const { projectIdentifier, orgIdentifier, accountId } = useParams()
  return (
    <Container>
      <Container height="calc(100vh - 100px)">
        <div className={css.monitoringContent}>
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
                          item.routeUrl({ activitySource: item.routeName, projectIdentifier, orgIdentifier, accountId })
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
                          item.routeUrl({ activitySource: item.routeName, projectIdentifier, orgIdentifier, accountId })
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
}
const MonitoringSourceContent: React.FC<MonitoringSourceContentProps> = () => {
  const history = useHistory()
  const { projectIdentifier, orgIdentifier, accountId } = useParams()
  return (
    <Layout.Horizontal>
      <Container height="100vh" width="70%">
        <div className={css.monitoringContent}>
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
                      item.routeUrl({ monitoringSource: item.routeName, projectIdentifier, orgIdentifier, accountId })
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
        </div>
      </Container>
    </Layout.Horizontal>
  )
}

const VerificatiionContent = () => {
  return <div>{/* TODO */}</div>
}

const CVSetupPage: React.FC<CVSetupPageProps> = props => {
  const [activitySource, setActivitySource] = useState<string>(Status.ACTIVE)
  const [monitoringSource, setMonitoringSource] = useState<string>(Status.NOT_VISITED)
  const [verificationJob, setVerificationJob] = useState<string>(Status.NOT_VISITED)
  const [activeStep, setActiveStep] = useState<string>(STEP.ACTIVITY_SOURCE)
  const location = useLocation()
  const history = useHistory()
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
  const categories = data?.resource?.stepsWhichAreCompleted

  useEffect(() => {
    if (step) {
      if (!categories?.includes('ACTIVITY_SOURCE')) {
        setActiveStep(STEP.ACTIVITY_SOURCE)
        setActivitySource(Status.ACTIVE)
      } else if (!categories?.includes('MONITORING_SOURCE')) {
        setActiveStep(STEP.MONITORING_SOURCE)
        setMonitoringSource(Status.ACTIVE)
        setActivitySource(Status.COMPLETED)
      } else if (!categories?.includes('VERIFICATION_JOBS')) {
        setActiveStep(STEP.VERIFICATION_JOBS)
        setVerificationJob(Status.ACTIVE)
        setMonitoringSource(Status.COMPLETED)
        setActivitySource(Status.COMPLETED)
      }
      //  Not required : Discuss after verification step
      // else {
      //   setActiveStep(STEP.ACTIVITY_SOURCE)
      //   setActivitySource(Status.ACTIVE)
      // }
    }
  }, [categories])
  return (
    <Container>
      {loading ? (
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
                    {/* <div style={{ borderLeft: '1px dashed black', height: 100 }}></div> */}
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
                    history.push(routes.toCVMainDashBoardPage({ accountId, projectIdentifier, orgIdentifier }))
                  } else if (activeStep === STEP.MONITORING_SOURCE) {
                    setActiveStep(STEP.ACTIVITY_SOURCE)
                    setActivitySource(Status.COMPLETED)
                  } else if (activeStep === STEP.VERIFICATION_JOBS) {
                    setActiveStep(STEP.MONITORING_SOURCE)
                    setMonitoringSource(Status.COMPLETED)
                  }
                }}
              />
              <Button
                intent="primary"
                text={i18n.NEXT}
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
                // setActivitySourceType={setActivitySourceType}
              />
            ) : activeStep === STEP.MONITORING_SOURCE ? (
              <MonitoringSourceContent
                statusData={data}
                monitoringSource={monitoringSource}
                setActiveStep={setActiveStep}
                setActivitySource={setActivitySource}
                setMonitoringSource={setMonitoringSource}
                setVerificationJob={setVerificationJob}
              />
            ) : activeStep === STEP.VERIFICATION_JOBS ? (
              <VerificatiionContent />
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
