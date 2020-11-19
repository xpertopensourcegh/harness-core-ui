import React from 'react'
import { Container, Text, Layout, Icon, Color } from '@wings-software/uikit'
import i18n from './ProgressStatus.i18n'
import css from '../CVSetupPage.module.scss'

interface ProgressStatusProps {
  numberOfServicesUsedInActivitySources: number | undefined
  numberOfServicesUsedInMonitoringSources: number | undefined
  totalNumberOfEnvironments: number | undefined
  totalNumberOfServices: number | undefined
  servicesUndergoingHealthVerification: number | undefined
}

const ProgressStatus: React.FC<ProgressStatusProps> = props => {
  return (
    <Container height="100vh" background={Color.WHITE} padding="large" width={'20%'}>
      <div className={css.progressContainer}>
        <Text font={{ size: 'medium', weight: 'bold' }} color={Color.BLACK} padding="small">
          {i18n.heading}
        </Text>
        <Layout.Vertical margin={{ top: 'large' }} spacing="medium">
          <Layout.Horizontal spacing="medium">
            <Icon name="tick-circle" size={16} color={Color.GREEN_500} />
            <Text>{i18n.serviceEnvCount(props.totalNumberOfServices || 0, props.totalNumberOfEnvironments || 0)}</Text>
          </Layout.Horizontal>
          {props.totalNumberOfServices && !props.numberOfServicesUsedInMonitoringSources ? (
            <Layout.Horizontal>
              <Text>{i18n.mapServices}</Text>
            </Layout.Horizontal>
          ) : null}
          {props.numberOfServicesUsedInActivitySources ? (
            <Layout.Horizontal spacing="medium">
              <Icon name="tick-circle" size={16} color={Color.GREEN_500} />
              <Text>{i18n.servicesUsedInActivitySources(props.numberOfServicesUsedInActivitySources)}</Text>
            </Layout.Horizontal>
          ) : null}
          {props.numberOfServicesUsedInMonitoringSources ? (
            <Layout.Horizontal spacing="medium">
              <Icon name="tick-circle" size={16} color={Color.GREEN_500} />
              <Text>{i18n.serviceUsedInMonitoringSources(props.numberOfServicesUsedInMonitoringSources)}</Text>
            </Layout.Horizontal>
          ) : null}
          {props.servicesUndergoingHealthVerification ? (
            <Layout.Horizontal spacing="medium">
              <Icon name="cv-main" size={18} />
              <Text>{i18n.servicesUndergoingHealthVerification(props.servicesUndergoingHealthVerification)}</Text>
            </Layout.Horizontal>
          ) : null}
        </Layout.Vertical>
      </div>
    </Container>
  )
}

export default ProgressStatus
