import React, { useState, ChangeEvent, useMemo } from 'react'
import { Container, Text, Color } from '@wings-software/uicore'
import cx from 'classnames'
import { useParams } from 'react-router-dom'
import { RiskScoreTile } from '@cv/components/RiskScoreTile/RiskScoreTile'
import { EnvServiceRiskDTO, RestResponseListEnvServiceRiskDTO, useGetEnvServiceRisks } from 'services/cv'
import i18n from './ServiceSelector.i18n'
import css from './ServiceSelector.module.scss'

interface ServiceSelectorProps {
  className?: string
  onSelect?: (environmentIdentifier?: string, serviceIdentifier?: string) => void
  isEmptyList?: (isEmpty: boolean) => void
}

interface RowProps {
  entityName: string
  riskScore: number
  selected?: boolean
  onSelect: (entityName: string) => void
}

const NO_DATA_RISK_SCORE = -1

function generateOverallRiskScores(serviceData?: EnvServiceRiskDTO[]): Map<string, number> {
  const riskScoreMap = new Map<string, number>()
  if (!serviceData) {
    return riskScoreMap
  }

  let maxOverallRiskScore = NO_DATA_RISK_SCORE
  for (const serviceInfo of serviceData) {
    if (!serviceInfo?.serviceRisks?.length || !serviceInfo?.envIdentifier) continue

    let envScore = NO_DATA_RISK_SCORE
    for (const serviceScore of serviceInfo.serviceRisks) {
      if (serviceScore?.risk && serviceScore.risk > envScore) envScore = serviceScore.risk
    }

    if (envScore > maxOverallRiskScore) maxOverallRiskScore = envScore
    riskScoreMap.set(serviceInfo.envIdentifier, envScore)
  }

  riskScoreMap.set(i18n.allServiceOptionText, maxOverallRiskScore)
  return riskScoreMap
}

function EnvironmentRow(props: RowProps): JSX.Element {
  const { entityName, riskScore, onSelect, selected } = props
  return (
    <Container
      flex
      data-selected={selected}
      className={cx(css.entityRow, css.environmentRow)}
      onClick={() => {
        onSelect(entityName)
      }}
    >
      <Text color={Color.BLACK} font={{ weight: 'bold' }}>
        {`${i18n.environmentLabelText} ${entityName}`}
      </Text>
      <RiskScoreTile riskScore={riskScore} isSmall />
    </Container>
  )
}

function ServiceRow(props: RowProps): JSX.Element {
  const { entityName, riskScore, selected, onSelect } = props
  return (
    <Container
      flex
      data-selected={selected}
      className={cx(css.entityRow, entityName === i18n.allServiceOptionText ? css.allServiceSelector : css.serviceRow)}
      onClick={() => {
        onSelect(entityName)
      }}
    >
      <Text color={Color.BLACK}>{entityName}</Text>
      <RiskScoreTile riskScore={riskScore} isSmall />
    </Container>
  )
}

export default function ServiceSelector(props: ServiceSelectorProps): JSX.Element {
  const { onSelect, className, isEmptyList } = props
  const { accountId, projectIdentifier, orgIdentifier } = useParams()

  const { refetch: refetchServices, data } = useGetEnvServiceRisks({
    queryParams: {
      accountId,
      projectIdentifier: projectIdentifier as string,
      orgIdentifier: orgIdentifier as string
    },
    resolve: (response: RestResponseListEnvServiceRiskDTO) => {
      isEmptyList?.(Number(response?.resource?.length) === 0)
      return response
    }
  })

  const serviceData = data?.resource
  const [selectedEntity, setSelectedEntity] = useState<{ envIdentifier?: string; serviceIdentifier?: string }>({
    serviceIdentifier: i18n.allServiceOptionText,
    envIdentifier: ''
  })
  const [filterText, setFilterText] = useState<string | undefined>()
  const overallRiskScoresMap = useMemo(() => generateOverallRiskScores(serviceData), [serviceData])
  const onSelectService = (envIdentifier?: string, serviceIdentifier?: string): void => {
    setSelectedEntity({ serviceIdentifier, envIdentifier })
    onSelect?.(envIdentifier, serviceIdentifier === i18n.allServiceOptionText ? undefined : serviceIdentifier)
    refetchServices()
  }
  return (
    <Container className={cx(css.main, className)} background={Color.GREY_100}>
      <input
        placeholder={i18n.searchInputPlaceholder}
        className={css.filterService}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)}
      />
      {serviceData?.map((serviceMapping, index: number) => {
        const { envIdentifier = '', serviceRisks = [] } = serviceMapping || {}
        const filterTextLowerCase = filterText?.toLocaleLowerCase()
        const filteredServiceRisks = filterText?.length
          ? serviceRisks.filter(serviceRisk =>
              serviceRisk.serviceIdentifier?.toLowerCase().includes(filterTextLowerCase!)
            )
          : serviceRisks
        return !filteredServiceRisks?.length ? null : (
          <Container key={envIdentifier}>
            {index === 0 &&
              (!filterTextLowerCase?.length || filterTextLowerCase.includes(i18n.allServiceOptionText)) && (
                <ServiceRow
                  entityName={i18n.allServiceOptionText}
                  riskScore={overallRiskScoresMap.get(i18n.allServiceOptionText) || 0}
                  selected={i18n.allServiceOptionText === selectedEntity.serviceIdentifier}
                  onSelect={() => onSelectService(undefined, i18n.allServiceOptionText)}
                />
              )}
            <EnvironmentRow
              entityName={envIdentifier}
              riskScore={overallRiskScoresMap.get(envIdentifier) || 0}
              selected={!selectedEntity?.serviceIdentifier && selectedEntity?.envIdentifier === envIdentifier}
              onSelect={() => onSelectService(envIdentifier)}
            />
            {filteredServiceRisks.map(serviceRisk => {
              const { serviceIdentifier = '', risk = 0 } = serviceRisk || {}
              return (
                <ServiceRow
                  entityName={serviceIdentifier}
                  riskScore={risk}
                  key={serviceIdentifier}
                  selected={
                    serviceIdentifier === selectedEntity?.serviceIdentifier &&
                    envIdentifier === selectedEntity?.envIdentifier
                  }
                  onSelect={() => onSelectService(envIdentifier, serviceIdentifier)}
                />
              )
            })}
          </Container>
        )
      })}
    </Container>
  )
}
