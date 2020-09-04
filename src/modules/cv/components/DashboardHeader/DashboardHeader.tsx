import React, { useState } from 'react'
import { Container, Color, Icon, Text } from '@wings-software/uikit'
import { Collapse } from '@blueprintjs/core'
import i18n from './DashboardHeader.i18n'
import styles from './DashboardHeader.module.scss'

export interface DashboardHeaderProps {
  name: string
  source: string
  basicInfo: any
  riskMinValue: number
  riskMaxValue: number
  risksBefore: Array<{ label: string; value: number }>
  risksAfter: Array<{ label: string; value: number }>
  riskScore: number
  verificationStatus: 'pass' | 'fail'
  dropDownContent: React.ReactNode
}

const basicInfoKeys = ['environment', 'service', 'activityType', 'verificationDuration']

export default function DashboardHeader({
  name,
  source,
  basicInfo,
  riskMaxValue,
  risksBefore,
  risksAfter,
  riskScore,
  verificationStatus,
  dropDownContent
}: DashboardHeaderProps) {
  const [expanded, setExpanded] = useState(false)
  const mapColor = (value: number) => {
    // TODO: temporary until we export colors from heatmap
    return value < 0.5 * riskMaxValue ? 'green400' : 'red500'
  }
  const mapRisk = (risk: any) => (
    <Container key={risk.label + risk.value}>
      <Text lineClamp={1} width={50} font="small">
        {risk.label}
      </Text>
      <Container height={10} width={10} margin={{ top: 'small' }} background={mapColor(risk.value)} />
    </Container>
  )

  return (
    <>
      <Container className={styles.dashboardHeader} background={Color.BLUE_200} padding="small">
        <Container margin={{ right: 'large' }} className={styles.source}>
          <Icon name="service-kubernetes" size={40} margin={{ right: 'small' }}></Icon>
          <Container>
            <Text font={{ size: 'medium', weight: 'bold' }}>{name}</Text>
            <Text>
              {`${i18n.source}: `}
              <Container tag="span" color={Color.BLUE_500}>
                {source}
              </Container>
            </Text>
          </Container>
        </Container>
        <Container margin={{ right: 'large' }} className={styles.details}>
          {basicInfoKeys.map((key: string) => (
            <Container key={key}>
              <Text font={{ weight: 'bold' }}>{`${(i18n as any)[key]}: `}</Text>
              <Text>{basicInfo[key]}</Text>
            </Container>
          ))}
        </Container>
        <Container margin={{ right: 'large' }} className={styles.risks}>
          <Text>{i18n.beforeChange}</Text>
          <Container className={styles.riskScores}>{risksBefore.map(mapRisk)}</Container>
        </Container>
        <Container margin={{ right: 'large' }} className={styles.risks}>
          <Text>{i18n.afterChange}</Text>
          <Container className={styles.riskScores}>{risksAfter.map(mapRisk)}</Container>
        </Container>
        <Container margin={{ right: 'large' }} className={styles.riskSummary}>
          <Text>{i18n.riskScore}</Text>
          <Text>{i18n.verificationStatus}</Text>
          <Container background={Color.RED_500} font="medium" className={styles.riskScore}>
            {riskScore}
          </Container>
          <Container
            className={styles.verificationStatus}
            background={verificationStatus === 'pass' ? Color.GREEN_700 : Color.RED_500}
          >
            {verificationStatus === 'pass' ? i18n.pass : i18n.fail}
          </Container>
        </Container>
        <Container className={styles.collapseButtonWrap}>
          <Icon size={20} color={Color.BLUE_400} name="caret-down" onClick={() => setExpanded(!expanded)} />
        </Container>
      </Container>
      <Collapse isOpen={expanded}>{dropDownContent}</Collapse>
    </>
  )
}

const mockedRisks = [
  { label: 'Perf', value: 0 },
  { label: 'Errors', value: 70 },
  { label: 'Infra', value: 0 },
  { label: 'Biz', value: 0 }
]

export const DashboardHeaderMocked = () => (
  <DashboardHeader
    name="Infrastructure Update"
    source="Kubernates"
    basicInfo={{
      environment: 'Freemium',
      service: 'N/A',
      activityTime: 'July',
      verificationDuration: '6 hours'
    }}
    riskMinValue={0}
    riskMaxValue={100}
    risksBefore={mockedRisks}
    risksAfter={mockedRisks}
    riskScore={90}
    verificationStatus="pass"
    dropDownContent={<b>Header content</b>}
  />
)
