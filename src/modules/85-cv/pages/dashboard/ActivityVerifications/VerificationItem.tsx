import React from 'react'
import { Container, Text, Color, Intent } from '@wings-software/uikit'
import { PopoverInteractionKind, Position, Tooltip, Spinner } from '@blueprintjs/core'
import moment from 'moment'
import {
  useGetVerificationsPopoverSummary,
  DeploymentActivityVerificationResultDTO,
  DeploymentPopoverSummary,
  VerificationResult
} from 'services/cv'
import { useRouteParams } from 'framework/exports'
import CVProgressBar from '@cv/components/CVProgressBar/CVProgressBar'
import ActivityType from '../ActivityType/ActivityType'
import ActivityProgressIndicator from '../ActivityProgressIndicator/ActivityProgressIndicator'
import { RiskScoreTile } from '../../../components/RiskScoreTile/RiskScoreTile'
import i18n from './ActivityVerifications.i18n'
import css from './ActivityVerifications.module.scss'

export default function VerificationItem({
  item,
  onClick
}: {
  item: DeploymentActivityVerificationResultDTO
  onClick?(): void
}) {
  const { serviceName, tag } = item
  const {
    params: { accountId, projectIdentifier, orgIdentifier }
  } = useRouteParams()
  const { data: tooltipData, loading, refetch: loadPopoverSummary } = useGetVerificationsPopoverSummary({
    deploymentTag: encodeURIComponent(tag as string),
    lazy: true
  })

  const onOpeningTooltip = () => {
    if (!tooltipData && !loading) {
      loadPopoverSummary({
        queryParams: {
          accountId,
          projectIdentifier: projectIdentifier as string,
          orgIdentifier: orgIdentifier as string,
          serviceIdentifier: serviceName as string
        }
      })
    }
  }

  const tooltipProps = {
    isLoading: loading,
    onOpening: onOpeningTooltip,
    tagName: tag,
    serviceName
  }

  return (
    <li className={css.dataRow} onClick={onClick}>
      <ActivityType buildName={tag!} serviceName={serviceName!} iconProps={{ name: 'nav-cd' }} />
      <ItemTooltip
        {...tooltipProps}
        phase="PRE_PROD"
        contentData={tooltipData?.resource?.preProductionDeploymentSummary}
      >
        <ActivityProgressIndicator data={item.preProductionDeploymentSummary} className={css.dataColumn} />
      </ItemTooltip>
      <ItemTooltip {...tooltipProps} phase="PROD" contentData={tooltipData?.resource?.productionDeploymentSummary}>
        <ActivityProgressIndicator data={item.productionDeploymentSummary} className={css.dataColumn} />
      </ItemTooltip>
      <ItemTooltip {...tooltipProps} phase="POST_DEPLOY" contentData={tooltipData?.resource?.postDeploymentSummary}>
        <ActivityProgressIndicator data={item.postDeploymentSummary} className={css.dataColumn} />
      </ItemTooltip>
    </li>
  )
}

function ItemTooltip(props: {
  tagName?: string
  serviceName?: string
  isLoading: boolean
  onOpening?(): void
  contentData?: DeploymentPopoverSummary
  phase: 'PRE_PROD' | 'PROD' | 'POST_DEPLOY'
  children: JSX.Element
}) {
  const label =
    (props.phase === 'PRE_PROD' && i18n.verificationTooltip.preProdVerifications) ||
    (props.phase === 'PROD' && i18n.verificationTooltip.prodVerifications) ||
    i18n.verificationTooltip.postDeployVerifications
  return (
    <Tooltip
      className={css.tooltipTarget}
      onOpening={props.onOpening}
      lazy={true}
      position={Position.TOP}
      interactionKind={PopoverInteractionKind.HOVER}
      content={
        <Container className={css.verificationTooltip}>
          {props.isLoading && <Spinner size={25} />}
          {!props.isLoading && (
            <>
              <Container className={css.tooltipHeader}>
                <Text color={Color.GREY_300} font={{ size: 'small' }}>
                  {props.tagName}
                </Text>
                <Text color={Color.GREY_400} font={{ size: 'small' }}>
                  {props.serviceName}
                </Text>
              </Container>
              <Container className={css.tooltipSubHeader}>
                <Text color={Color.GREY_400} font={{ size: 'small' }}>{`${
                  props.contentData?.total ?? 0
                } ${label}`}</Text>
                <Text color={Color.GREY_400} font={{ size: 'small' }}>
                  {i18n.verificationTooltip.risk}
                </Text>
              </Container>
              {props.contentData?.verificationResults?.map((item, index) => (
                <Container key={index} className={css.tooltipItem}>
                  <Container className={css.tooltipItemContent}>
                    <Container className={css.tooltipNameGroup}>
                      <Text color={Color.GREY_300} font={{ size: 'small' }}>
                        {item.jobName}
                      </Text>
                      <Text color={Color.GREY_400} font={{ size: 'xsmall' }}>
                        {mapTooltipItemStatus(item.status, item.remainingTimeMs)}
                      </Text>
                    </Container>
                    <CVProgressBar
                      intent={mapProgressBarIntent(item.status)}
                      stripes={false}
                      value={item.progressPercentage}
                    />
                    <Container className={css.tooltipDateGroup}>
                      <Text color={Color.GREY_300} font={{ size: 'xsmall' }} style={{ marginRight: 2 }}>
                        {i18n.verificationTooltip.startedOn}:
                      </Text>
                      <Text color={Color.GREY_400} font={{ size: 'xsmall' }}>
                        {' '}
                        {moment(item.startTime).format('MMM D, h:mm:ss a')}
                      </Text>
                    </Container>
                  </Container>
                  <RiskScoreTile riskScore={50} isSmall />
                </Container>
              ))}
            </>
          )}
        </Container>
      }
    >
      {props.children}
    </Tooltip>
  )
}

function mapTooltipItemStatus(status: VerificationResult['status'], remainingTimeMs?: number) {
  switch (status) {
    case 'ERROR':
      return i18n.verificationTooltip.statusError
    case 'IN_PROGRESS':
      return Math.floor(remainingTimeMs! / 1000) + i18n.verificationTooltip.minRemaining
    case 'NOT_STARTED':
      return i18n.verificationTooltip.statusNotStarted
    case 'VERIFICATION_FAILED':
      return i18n.verificationTooltip.statusFailed
    case 'VERIFICATION_PASSED':
      return i18n.verificationTooltip.statusPassed
  }
}

function mapProgressBarIntent(status: VerificationResult['status']) {
  switch (status) {
    case 'ERROR':
    case 'VERIFICATION_FAILED':
      return Intent.DANGER
    case 'VERIFICATION_PASSED':
      return Intent.SUCCESS
    default:
      return Intent.NONE
  }
}
