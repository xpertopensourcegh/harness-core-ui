import React, { useMemo } from 'react'
import { PopoverInteractionKind, Position, Tooltip, ITooltipProps, Spinner } from '@blueprintjs/core'
import { Container, Text, Color } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import classnames from 'classnames'
import { useGetRiskSummaryPopover, RestResponseRiskSummaryPopoverDTO } from 'services/cv'
import type { ProjectPathProps, AccountPathProps } from '@common/interfaces/RouteInterfaces'
import { RiskScoreTile } from '@cv/components/RiskScoreTile/RiskScoreTile'
import { NoDataCard } from '@common/components/Page/NoDataCard'
import { useStrings } from 'framework/exports'
import styles from './RiskCardTooltip.module.scss'

export interface RiskCardTooltipProps {
  category?: string
  endTime?: number
  children: React.ReactNode
  tooltipProps?: Partial<ITooltipProps>
  disabled?: boolean
}

export function getMaxEnvScores(data?: RestResponseRiskSummaryPopoverDTO | null): Record<string, number> {
  const getScore = (score?: number) => (typeof score === 'number' ? score : -1)
  const maxScores: Record<string, number> = {}
  for (const envSummary of data?.resource?.envSummaries ?? []) {
    let envMaxScore = getScore(envSummary.riskScore)
    for (const serviceSummary of envSummary?.serviceSummaries ?? []) {
      envMaxScore = Math.max(envMaxScore, getScore(serviceSummary.risk))
      for (const analysisSummary of serviceSummary?.analysisRisks ?? []) {
        envMaxScore = Math.max(envMaxScore, getScore(analysisSummary.risk))
      }
    }
    maxScores[envSummary.envIdentifier!] = envMaxScore
  }
  return maxScores
}

export function isRiskLow(risk: number) {
  return risk >= 0 && risk <= 27
}

export default function RiskCardTooltip(props: RiskCardTooltipProps) {
  const { accountId, projectIdentifier, orgIdentifier } = useParams<ProjectPathProps & AccountPathProps>()
  const { getString } = useStrings()
  const withEndTime = Number.isInteger(props.endTime) && props.endTime! > 0
  const { data, loading, refetch } = useGetRiskSummaryPopover({ lazy: true })

  const onOpening = () => {
    if (!data && !loading) {
      refetch({
        queryParams: {
          accountId,
          projectIdentifier,
          orgIdentifier,
          category: props?.category?.toUpperCase() ?? (undefined as any),
          endTime: withEndTime ? new Date(props.endTime!).getTime() : new Date().getTime()
        }
      })
    }
  }

  const hasData = !!data?.resource?.envSummaries?.length

  const maxEnvScores = useMemo(() => getMaxEnvScores(data), [data])
  const shouldCompressScores = (envIdentifier: string) => isRiskLow(maxEnvScores[envIdentifier])

  if (props.disabled) {
    return React.isValidElement(props.children) ? props.children : null
  }

  let tooltipContent = null
  if (loading) {
    tooltipContent = <Spinner size={25} />
  } else if (!hasData) {
    tooltipContent = (
      <Container padding={{ top: 'xxxlarge' }}>
        <NoDataCard iconSize={20} message={getString('noSearchResultsFoundPeriod')} icon="warning-sign" />
      </Container>
    )
  } else {
    tooltipContent = (
      <>
        <Container className={styles.header}>{getString('cv.riskCardTooltip.header')}</Container>
        <Container flex margin={{ bottom: 'large' }}>
          <Text lineClamp={1} color={Color.WHITE}>
            {getString('environment')}
          </Text>
          <Text color={Color.WHITE}>{getString('risk')}</Text>
        </Container>
        {data?.resource?.envSummaries?.map(envSummary => (
          <>
            <TooltipRow
              className={styles.envRow}
              name={
                envSummary.envName +
                (shouldCompressScores(envSummary.envIdentifier!)
                  ? ` (${getString('cv.riskCardTooltip.allServicesGreen')})`
                  : '')
              }
              risk={
                shouldCompressScores(envSummary.envIdentifier!)
                  ? maxEnvScores[envSummary.envIdentifier!]
                  : envSummary.riskScore
              }
            />
            {!shouldCompressScores(envSummary.envIdentifier!) &&
              envSummary?.serviceSummaries?.map(serviceSummary => (
                <>
                  <TooltipRow
                    className={styles.serviceRow}
                    name={serviceSummary.serviceName}
                    risk={serviceSummary.risk}
                  />
                  {serviceSummary?.analysisRisks?.map((analysisSummary, index) => (
                    <TooltipRow
                      key={index}
                      className={styles.transactionRow}
                      name={analysisSummary.name}
                      risk={analysisSummary.risk}
                    />
                  ))}
                </>
              ))}
          </>
        ))}
      </>
    )
  }

  return (
    <Tooltip
      onOpening={onOpening}
      lazy={true}
      position={Position.TOP}
      interactionKind={PopoverInteractionKind.HOVER}
      {...(props?.tooltipProps ?? {})}
      content={<Container className={styles.main}>{tooltipContent}</Container>}
    >
      {props.children}
    </Tooltip>
  )
}

export function TooltipRow({ name, risk, className }: { name?: string; risk?: number; className?: string }) {
  return (
    <Container className={classnames(styles.tooltipRow, className)} flex>
      <Text className={styles.nameText} lineClamp={1}>
        {name}
      </Text>
      <RiskScoreTile riskScore={risk!} isSmall />
    </Container>
  )
}
