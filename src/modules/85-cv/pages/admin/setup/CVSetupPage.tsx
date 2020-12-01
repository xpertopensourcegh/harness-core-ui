import React, { useState, useEffect } from 'react'
import { Text, Layout, Container, Button, Color, Icon, Link, Card, CardBody, IconName } from '@wings-software/uikit'
import cx from 'classnames'
import { useParams, useHistory } from 'react-router-dom'
import { useGetCVSetupStatus, RestResponseCVSetupStatus } from 'services/cv'
import { PageError } from '@common/components/Page/PageError'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import routes from '@common/RouteDefinitions'
import type { UseGetMockData } from '@common/utils/testUtils'
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
    label: 'AppDynamics'
  },
  {
    type: 'Splunk',
    icon: 'service-splunk',
    label: 'Splunk'
  }
]
interface CVSetupPageProps {
  setupStatusMockData?: UseGetMockData<RestResponseCVSetupStatus>
}
interface ActivitySourceContentProps {
  setActiveStep: (val: string) => void
  setActivitySource: (val: string) => void
  setDataSource: (val: string) => void
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
            props.setDataSource(Status.ACTIVE)
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
  setDataSource: (val: string) => void
  setVerificationJob: (val: string) => void
  monitoringSource: string
  monitoringSourceType: string
  setMonitoringSourceType: (val: string) => void
}
const MonitoringSourceContent: React.FC<MonitoringSourceContentProps> = props => {
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
                <div className={css.cardWrapper} key={`${index}${item}`}>
                  <Card
                    interactive={true}
                    className={cx(css.cardCss, { [css.cardSelected]: props.monitoringSourceType === item.type })}
                    onClick={() => props.setMonitoringSourceType(item.type)}
                  >
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
  const [monitoringSource, setDataSource] = useState<string>(Status.NOT_VISITED)
  const [verificationJob, setVerificationJob] = useState<string>(Status.NOT_VISITED)
  const [activeStep, setActiveStep] = useState<string>(STEP.ACTIVITY_SOURCE)
  // const [activitySourceType, setActivitySourceType] = useState()
  const [monitoringSourceType, setMonitoringSourceType] = useState('')
  const history = useHistory()

  const { accountId, orgIdentifier, projectIdentifier } = useParams()

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
    if (!categories?.includes('ACTIVITY_SOURCE')) {
      setActiveStep(STEP.ACTIVITY_SOURCE)
    } else if (!categories?.includes('MONITORING_SOURCE')) {
      setActiveStep(STEP.MONITORING_SOURCE)
    } else if (!categories?.includes('VERIFICATION_JOBS')) {
      setActiveStep(STEP.VERIFICATION_JOBS)
    } else {
      setActiveStep(STEP.ACTIVITY_SOURCE)
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
                    ) : activitySource === Status.ACTIVE ? (
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
                      color={activitySource === Status.ACTIVE ? Color.BLACK : Color.GREY_500}
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
                    ) : monitoringSource === Status.ACTIVE ? (
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
                      color={monitoringSource === Status.ACTIVE ? Color.BLACK : Color.GREY_500}
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
                    ) : verificationJob === Status.ACTIVE ? (
                      <span className={css.number}>{3}</span>
                    ) : (
                      <span className={css.onlyNumber}> 3</span>
                    )}
                    {/* <div style={{ borderLeft: '1px dashed black', height: 100 }}></div> */}
                  </Layout.Vertical>
                  <Layout.Vertical width="90%" className={css.stepLabel} spacing="small">
                    <Text
                      font={{ size: 'medium', weight: 'bold' }}
                      color={verificationJob === Status.ACTIVE ? Color.BLACK : Color.GREY_500}
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
              <Button text="Previous" icon="chevron-left" onClick={() => alert('Hello World')} />
              <Button
                intent="primary"
                text={i18n.NEXT}
                rightIcon="chevron-right"
                onClick={() => {
                  if (monitoringSource === Status.ACTIVE) {
                    history.push(
                      routes.toCVAdminSetupMonitoringSource({
                        orgIdentifier: orgIdentifier,
                        projectIdentifier: projectIdentifier,
                        monitoringSource: monitoringSourceType,
                        accountId
                      })
                    )
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
                setDataSource={setDataSource}
                // setActivitySourceType={setActivitySourceType}
              />
            ) : activeStep === STEP.MONITORING_SOURCE ? (
              <MonitoringSourceContent
                statusData={data}
                monitoringSource={monitoringSource}
                setActiveStep={setActiveStep}
                setActivitySource={setActivitySource}
                setDataSource={setDataSource}
                setVerificationJob={setVerificationJob}
                setMonitoringSourceType={setMonitoringSourceType}
                monitoringSourceType={monitoringSourceType}
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
