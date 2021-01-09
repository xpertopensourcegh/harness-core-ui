import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import cx from 'classnames'
import { StepsProgress, Layout, Button, Text, Intent, Color, StepProps, Container } from '@wings-software/uicore'
import { useGetDelegateFromId } from 'services/portal'
import {
  useGetTestConnectionResult,
  ResponseConnectorValidationResult,
  ConnectorConfigDTO,
  ConnectorConnectivityDetails
} from 'services/cd-ng'
import type { UseGetMockData } from '@common/utils/testUtils'
import type { StepDetails } from '@connectors/interfaces/ConnectorInterface'
import { Connectors, ConnectorStatus } from '@connectors/constants'
import { useStrings } from 'framework/exports'
import { GetTestConnectionValidationTextByType } from '@connectors/pages/connectors/utils/ConnectorUtils'
import i18n from './VerifyOutOfClusterDelegate.i18n'
import css from './VerifyOutOfClusterDelegate.module.scss'

interface RenderUrlInfo {
  type: string
  url?: string
}

interface VerifyOutOfClusterDelegateProps {
  testConnectionMockData?: UseGetMockData<ResponseConnectorValidationResult>
  type: string
  hideLightModal?: () => void
  setIsEditMode?: (val: boolean) => void // Remove after removing all usages
  connectorIdentifier?: string
  name?: string
  url?: string
  onSuccess?: () => void
  renderInModal?: boolean
  setLastTested?: (val: number) => void
  setLastConnected?: (val: number) => void
  setStatus?: (val: ConnectorConnectivityDetails['status']) => void
  setTesting?: (val: boolean) => void
  isLastStep?: boolean
}
export interface VerifyOutOfClusterStepProps extends ConnectorConfigDTO {
  isEditMode?: boolean
}

export const STEP = {
  TEST_CONNECTION: 'TEST_CONNECTION'
}
export const StepIndex = new Map([[STEP.TEST_CONNECTION, 1]])

const RenderUrlInfo: React.FC<StepProps<VerifyOutOfClusterStepProps> & RenderUrlInfo> = props => {
  const { getString } = useStrings()

  const getLabel = () => {
    switch (props.type) {
      case Connectors.KUBERNETES_CLUSTER:
        return getString('connectors.testConnectionStep.url.k8s')
      case Connectors.DOCKER:
        return getString('connectors.testConnectionStep.url.docker')
      case Connectors.NEXUS:
        return getString('connectors.testConnectionStep.url.nexus')
      case Connectors.ARTIFACTORY:
        return getString('connectors.testConnectionStep.url.artifactory')

      case Connectors.APP_DYNAMICS:
        return getString('connectors.testConnectionStep.url.appD')

      case Connectors.SPLUNK:
        return getString('connectors.testConnectionStep.url.splunk')

      case Connectors.VAULT:
        return getString('connectors.testConnectionStep.url.vault')
      case Connectors.BITBUCKET:
      case Connectors.GITLAB:
      case Connectors.GITHUB:
        return getString('connectors.testConnectionStep.url.bitbucket')

      default:
        return ''
    }
  }
  const getValue = () => {
    switch (props.type) {
      case Connectors.KUBERNETES_CLUSTER:
        return props.prevStepData?.masterUrl
      case Connectors.DOCKER:
        return props.prevStepData?.dockerRegistryUrl
      case Connectors.NEXUS:
        return props.prevStepData?.nexusServerUrl

      case Connectors.ARTIFACTORY:
        return props.prevStepData?.artifactoryServerUrl

      case Connectors.APP_DYNAMICS:
        return props.prevStepData?.controllerUrl

      case Connectors.SPLUNK:
        return props.prevStepData?.splunkUrl

      case Connectors.VAULT:
        return props.prevStepData?.spec?.vaultUrl
      case Connectors.BITBUCKET:
      case Connectors.GITLAB:
      case Connectors.GITHUB:
        return props.prevStepData?.url

      default:
        return ''
    }
  }

  return (
    <Layout.Horizontal padding={{ top: 'xsmall' }} spacing="xsmall">
      <Text color={Color.GREY_400} font={{ size: 'small' }} className={css.subHeading}>
        {getLabel()}
      </Text>
      <Text color={Color.GREY_600} font={{ size: 'small' }} className={css.subHeading} lineClamp={1} width={'600px'}>
        {props.url || getValue()}
      </Text>
    </Layout.Horizontal>
  )
}

const VerifyOutOfClusterDelegate: React.FC<
  StepProps<VerifyOutOfClusterStepProps> & VerifyOutOfClusterDelegateProps
> = props => {
  const { prevStepData, nextStep, isLastStep = false, renderInModal = false } = props
  const { accountId, projectIdentifier, orgIdentifier } = useParams()

  const [viewDetails, setViewDetails] = useState<boolean>(false)
  const [testConnectionResponse, setTestConnectionResponse] = useState<ResponseConnectorValidationResult>()
  const [stepDetails, setStepDetails] = useState<StepDetails>({
    step: 1,
    intent: Intent.WARNING,
    status: 'PROCESS'
  })

  const { getString } = useStrings()

  const getPermissionsLink = () => {
    switch (props.type) {
      case Connectors.KUBERNETES_CLUSTER:
        return 'https://docs.harness.io/article/l68rujg6mp-add-kubernetes-cluster-cloud-provider#review_permissions_required'
      case Connectors.DOCKER:
        return 'https://docs.harness.io/article/tdj2ghkqb0-add-docker-registry-artifact-servers#review_docker_registry_permissions'
      case Connectors.AWS:
        return 'https://docs.harness.io/article/wt1gnigme7-add-amazon-web-services-cloud-provider#review_aws_permissions'
      case Connectors.NEXUS:
        return 'https://docs.harness.io/article/6y6b8pkm12-add-nexus-artifact-servers#review_nexus_permissions'
      case Connectors.ARTIFACTORY:
        return 'https://docs.harness.io/article/nj3p1t7v3x-add-artifactory-servers#review_artifactory_permissions'
      case Connectors.GCP:
        return 'https://docs.harness.io/article/6x52zvqsta-add-google-cloud-platform-cloud-provider#review_gcp_permissions_required'

      default:
        return ''
    }
  }

  const { mutate: reloadTestConnection, loading } = useGetTestConnectionResult({
    identifier: props.connectorIdentifier || prevStepData?.identifier || '',
    queryParams: { accountIdentifier: accountId, orgIdentifier: orgIdentifier, projectIdentifier: projectIdentifier },
    mock: props.testConnectionMockData,
    requestOptions: {
      headers: {
        'content-type': 'application/json'
      }
    }
  })

  const {
    data: delegate,
    error: delegateError,
    refetch: refetchDelegateFromId,
    loading: loadingDelegate
  } = useGetDelegateFromId({
    delegateId: testConnectionResponse?.data?.delegateId || '',
    queryParams: { accountId },
    lazy: true
  })

  const renderError = () => {
    return (
      <Layout.Vertical className={css.stepError}>
        <Layout.Horizontal className={css.errorResult}>
          <Text
            color={Color.GREY_900}
            lineClamp={1}
            font={{ size: 'small', weight: 'semi-bold' }}
            margin={{ top: 'small', bottom: 'small' }}
          >
            {testConnectionResponse?.data?.errorSummary}
          </Text>
          <Button
            width={'120px'}
            text="View Details"
            intent="primary"
            font={{ size: 'small' }}
            minimal
            onClick={() => setViewDetails(!viewDetails)}
            rightIcon={viewDetails ? 'chevron-up' : 'chevron-down'}
            iconProps={{ size: 12 }}
          />
        </Layout.Horizontal>
        {viewDetails ? (
          <div className={css.errorMsg} view-details={viewDetails}>
            <pre>
              {JSON.stringify(JSON.parse(JSON.stringify({ errors: testConnectionResponse?.data?.errors })), null, ' ')}
            </pre>
          </div>
        ) : null}
        {/* TODO: when install delegate behaviour is known {testConnectionResponse?.data?.delegateId ? ( */}
        <Layout.Horizontal spacing="small">
          {renderInModal ? (
            <Button
              text={i18n.EDIT_CREDS}
              onClick={() => {
                props.previousStep?.({ ...prevStepData })
                props.setIsEditMode?.(true) // Remove after all usages
              }}
            />
          ) : null}
          <Text
            onClick={() => window.open(getPermissionsLink(), '_blank')}
            className={cx(css.veiwPermission, { [css.marginAuto]: renderInModal })}
            color={Color.BLUE_500}
          >
            {getString('connectors.testConnectionStep.viewPermissions')}
          </Text>
        </Layout.Horizontal>
        {/* ) : (
          <Button text={getString('connectors.testConnectionStep.installNewDelegate')} disabled width="160px" />
        )} */}
      </Layout.Vertical>
    )
  }

  const getStepOne = () => {
    return (
      <Layout.Vertical width={'100%'}>
        <Text color={Color.GREY_600}>{GetTestConnectionValidationTextByType(props.type)}</Text>
        {!loading && testConnectionResponse?.data?.delegateId ? (
          <Text
            padding={{ top: 'xsmall' }}
            color={!loadingDelegate ? Color.GREY_900 : Color.GREY_200}
            font={{ size: 'small' }}
          >
            {getString('connectors.testConnectionStep.executingOn')}
            {loadingDelegate
              ? getString('loading')
              : delegateError
              ? getString('connectors.testConnectionStep.noDelegate')
              : delegate?.resource?.hostName}
          </Text>
        ) : null}

        {stepDetails.step === StepIndex.get(STEP.TEST_CONNECTION)
          ? stepDetails.status === 'ERROR' &&
            testConnectionResponse?.data?.errorSummary &&
            testConnectionResponse.data.errors
            ? renderError()
            : null
          : null}
      </Layout.Vertical>
    )
  }

  const executeEstablishConnection = async (): Promise<void> => {
    if (stepDetails.step === StepIndex.get(STEP.TEST_CONNECTION)) {
      if (stepDetails.status === 'PROCESS') {
        try {
          const result = await reloadTestConnection()
          props.setLastTested?.(new Date().getTime() || 0)

          setTestConnectionResponse(result)
          if (result?.data?.status === 'SUCCESS') {
            props.setStatus?.(ConnectorStatus.SUCCESS)
            setStepDetails({
              step: 2,
              intent: Intent.SUCCESS,
              status: 'DONE'
            })
          } else {
            props.setStatus?.(ConnectorStatus.FAILURE)
            setStepDetails({
              step: 1,
              intent: Intent.DANGER,
              status: 'ERROR'
            })
          }
        } catch (err) {
          props.setStatus?.(ConnectorStatus.FAILURE)
          setStepDetails({
            step: 1,
            intent: Intent.DANGER,
            status: 'ERROR'
          })
        }
      }
    }
  }
  useEffect(() => {
    executeEstablishConnection()
  }, [])

  useEffect(() => {
    if (testConnectionResponse?.data?.delegateId) {
      refetchDelegateFromId()
    }
  }, [testConnectionResponse?.data?.delegateId])
  return (
    <Layout.Vertical padding={{ top: 'large', right: 'small', left: 'small', bottom: 'large' }} height={'100%'}>
      <Layout.Vertical>
        <Text font={{ size: 'medium', weight: 'semi-bold' }} color={Color.GREY_800}>
          {getString('connectors.stepThreeName')}
        </Text>
        {renderInModal ? <RenderUrlInfo type={props.type} prevStepData={prevStepData} url={props.url} /> : null}
        <Container className={css.content} padding={{ top: 'xxlarge' }}>
          <StepsProgress
            steps={[getStepOne()]}
            intent={stepDetails.intent}
            current={stepDetails.step}
            currentStatus={stepDetails.status}
          />

          {stepDetails.status === 'DONE' ? (
            <Text color={Color.GREEN_600} font={{ weight: 'bold' }} padding={{ top: 'large' }}>
              {getString('connectors.testConnectionStep.verificationSuccessful')}
            </Text>
          ) : null}
        </Container>
      </Layout.Vertical>
      {renderInModal ? (
        isLastStep ? (
          <Layout.Horizontal spacing="large" className={css.btnWrapper}>
            <Button
              disabled={loading || stepDetails.status === 'ERROR'}
              intent="primary"
              onClick={() => {
                props.hideLightModal?.()
                props.onSuccess?.()
              }}
              text={getString('finish')}
            />
          </Layout.Horizontal>
        ) : (
          <Layout.Horizontal spacing="large" className={css.btnWrapper}>
            <Button
              intent="primary"
              onClick={() => {
                nextStep?.({ ...prevStepData })
              }}
              text={i18n.CONTINUE}
            />
          </Layout.Horizontal>
        )
      ) : null}
    </Layout.Vertical>
  )
}

export default VerifyOutOfClusterDelegate
